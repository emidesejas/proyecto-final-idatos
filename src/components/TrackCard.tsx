import type { TrackObject } from "@utils/spotifyClient";

export const TrackCard = ({
  track: { album, name, artists },
}: {
  track: TrackObject;
}) => (
  <div className="mt-2 flex h-16 flex-row gap-2 rounded-sm p-2 transition-all hover:bg-gray-50">
    {album.images.length > 0 && album.images[0] && (
      <div
        className="aspect-square h-full rounded bg-cover object-cover"
        style={{ backgroundImage: `url(${album.images[0].url})` }}
      />
    )}

    <div className="flex flex-col">
      <h2 className="font-bold">{name}</h2>
      {artists && artists.length > 0 && (
        <h3 className="font-light">
          {artists.map(({ name }) => name).join(", ")}
        </h3>
      )}
    </div>
  </div>
);
