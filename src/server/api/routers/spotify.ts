import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@server/api/trpc";
import { search, getTrack } from "@utils/spotifyClient";
import { TRPCError } from "@trpc/server";

export const spotifyRouter = createTRPCRouter({
  search: protectedProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input: { text } }) => search(text)),
  saveTrack: protectedProcedure
    .input(z.object({ trackId: z.string() }))
    .mutation(async ({ input: { trackId }, ctx }) => {
      const track = await ctx.db.track.findFirst({
        where: {
          identifiers: {
            some: { externalId: trackId, type: "spotify" },
          },
        },
      });

      if (track === null) {
        const spotifyTrackData = await getTrack(trackId);

        console.log(spotifyTrackData);

        if (spotifyTrackData === null) {
          throw new TRPCError({
            message: "Spotify track not found",
            code: "NOT_FOUND",
          });
        }

        const artists = await Promise.all(
          spotifyTrackData.artists.map(async (artist) => {
            const dbArtist = await ctx.db.artist.findFirst({
              where: {
                identifiers: {
                  some: { externalId: artist.id, type: "spotify" },
                },
              },
              select: { id: true },
            });

            return {
              create: {
                name: artist.name,
                image: artist.images?.[0]?.url ?? "",
                identifiers: {
                  create: {
                    externalId: artist.id,
                    type: "spotify",
                    url: "",
                  },
                },
              },
              where: dbArtist === null ? { id: "" } : { id: dbArtist.id },
            };
          }),
        );

        const album = await ctx.db.album.findFirst({
          where: {
            identifiers: {
              some: { externalId: spotifyTrackData.album.id, type: "spotify" },
            },
          },
          select: { id: true },
        });

        const newTrack = await ctx.db.track.create({
          data: {
            identifiers: {
              create: {
                externalId: trackId,
                type: "spotify",
                url: "",
              },
            },
            duration: spotifyTrackData.durationMs,
            explicit: spotifyTrackData.explicit,
            name: spotifyTrackData.name,
            image: spotifyTrackData.album.images[0]?.url ?? "",
            artists: {
              connectOrCreate: artists,
            },
            album: {
              connectOrCreate: {
                create: {
                  title: spotifyTrackData.album.name,
                  image: spotifyTrackData.album.images[0]?.url ?? "",
                  identifiers: {
                    create: {
                      externalId: spotifyTrackData.album.id,
                      type: "spotify",
                      url: "",
                    },
                  },
                  releaseDate: `${spotifyTrackData.album.releaseDate}T00:00:00.000Z`,
                  totalTracks: spotifyTrackData.album.totalTracks,
                },
                where: album === null ? { id: "" } : { id: album.id },
              },
            },
          },
        });
        return newTrack.id;
      }

      return track.id;
    }),
});
