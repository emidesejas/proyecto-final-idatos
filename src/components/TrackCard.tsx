import { api, type RouterOutputs } from "@utils/api";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { useToast } from "./ui/use-toast";
import { useState } from "react";
import { useRouter } from "next/router";

type TrackObject = NonNullable<
  RouterOutputs["spotify"]["search"]
>["tracks"]["items"][number];

export const TrackCard = ({
  track: { album, name, artists, id },
}: {
  track: TrackObject;
}) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const { mutate: saveSpotifyTrack } = api.spotify.saveTrack.useMutation({
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo cargar la canción, reintenta en unos segundos",
      });
      setLoading(false);
    },
    onSuccess: async (trackId) => {
      await router.push(`/tracks/${trackId}`);
    },
  });

  const onViewDetails = () => {
    setLoading(true);
    saveSpotifyTrack({ trackId: id });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
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
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="relative">
          {album.images.length > 0 && album.images[0] && (
            <div
              className="absolute left-[calc(50%-2rem)] -mt-16 aspect-square h-16 rounded bg-cover object-cover"
              style={{ backgroundImage: `url(${album.images[0].url})` }}
            />
          )}
          <div className="flex flex-col items-center">
            <h2 className="font-bold">{name}</h2>
            {artists && artists.length > 0 && (
              <h3 className="font-light">
                {artists.map(({ name }) => name).join(", ")}
              </h3>
            )}
          </div>
        </DialogHeader>

        <div className="flex flex-col items-start">
          <h3 className="font-bold">Album</h3>
          <h4 className="font-light">{album.name}</h4>
        </div>

        <DialogFooter>
          <div className="flex w-full justify-center">
            <Button
              onClick={onViewDetails}
              loading={loading}
              disabled={loading}
            >
              Ver más datos de la canción
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
