import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@server/api/trpc";
import { getMusicbrainzId } from "@utils/musicbrainzClient";
import { getLastFmTrackData, searchLastFm } from "@utils/lastFmClient";

export const tracksRouter = createTRPCRouter({
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input: { id }, ctx: { db } }) =>
      db.track.findFirst({
        where: { id },
        include: { album: true, artists: true },
      }),
    ),
  populateLastFm: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input: { id }, ctx: { db } }) => {
      const musicbrainzIdentifier = await db.identifier.findFirst({
        where: { trackId: id, type: "musicbrainz" },
      });

      let musicbrainzId: string | null =
        musicbrainzIdentifier?.externalId ?? null;

      if (musicbrainzIdentifier === null) {
        console.warn("No musicbrainz identifier found for track", id);

        const isrcIdentifier = await db.identifier.findFirst({
          where: { trackId: id, type: "isrc" },
        });

        if (isrcIdentifier === null) {
          console.log("No isrc identifier found for track", id);
          return null;
        }
        musicbrainzId = await getMusicbrainzId(isrcIdentifier.externalId);

        if (musicbrainzId === null) {
          console.log("No musicbrainz id found for track", id);
          return null;
        }

        await db.identifier.create({
          data: {
            externalId: musicbrainzId,
            type: "musicbrainz",
            url: "",
            trackId: id,
          },
        });
      }

      // TODO: Type narrowing not working
      const lastFmData = await getLastFmTrackData(musicbrainzId!);

      if (lastFmData === null) {
        console.log("Stopping LastFm population since response is null");
        const track = await db.track.findFirst({
          where: { id },
        });
        const searchData = await searchLastFm(track?.name ?? "");
        console.log("searchData", searchData?.results.trackmatches);
        return null;
      }

      return await db.track.update({
        where: { id },
        data: {
          playCount: parseInt(lastFmData.track.playcount),
          listeners: parseInt(lastFmData.track.listeners),
          releaseDate: new Date(lastFmData.track.wiki?.published),
          wikiDescription: lastFmData.track.wiki?.content?.split("<")[0] ?? "",
          tags: lastFmData.track.toptags.tag.map((tag) => tag.name),
        },
      });
    }),
});
