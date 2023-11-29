import Header from "@components/Header";
import { Skeleton } from "@components/ui/skeleton";
import { useToast } from "@components/ui/use-toast";
import { api } from "@utils/api";
import { cn } from "@utils/shadcn";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import dayjs from "@utils/dayjs";
import { ScrollArea } from "@components/ui/scroll-area";

const LoadingState = () => (
  <div className="flex h-screen w-full flex-col">
    <div className="h-1/6 bg-gray-50" />
    <div className="h-16 w-full">
      <Skeleton className="absolute left-[calc(50%-4rem)] -mt-16 aspect-square h-32 rounded" />
    </div>
    <div className="flex flex-1 flex-col items-center justify-start p-4">
      <Skeleton className="h w-12" />
    </div>
  </div>
);

const TrackPage = () => {
  const { query } = useRouter();

  const { toast } = useToast();

  const [hasFetchedLastFm, setHasFetchedLastFm] = useState(false);

  const { data: track, refetch: refetchTrack } = api.tracks.getById.useQuery({
    id: query.id as string,
  });
  const { mutate: populateLastFm } = api.tracks.populateLastFm.useMutation({
    onSuccess: (data) => {
      if (!data?.wikiDescription) {
        toast({
          variant: "destructive",
          title: "Ups",
          description: "last.fm no contiene información de esta canción",
        });
      }
      toast({
        title: "Sincronización exitosa",
        description: "La información de last.fm se sincronizó correctamente",
      });
      void refetchTrack();
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          "No se pudo cargar la información de last.fm, recarga la página para reintentar",
      });
    },
  });

  useEffect(() => {
    if (track && !track.wikiDescription && !hasFetchedLastFm) {
      toast({
        variant: "default",
        title: "Información",
        description: (
          <div className="flex flex-row items-center justify-start">
            <Loader2 className={cn("mr-2 h-4 w-4 animate-spin")} /> Estamos
            sincronizando con last.fm
          </div>
        ),
      });
      populateLastFm({ id: track.id });
      setHasFetchedLastFm(true);
    }
  }, [track, populateLastFm, toast, setHasFetchedLastFm, hasFetchedLastFm]);

  if (!track) {
    return <LoadingState />;
  }

  return (
    <main className=" h-screen">
      <Header />
      <div className="flex w-full flex-col">
        <div className="flex h-fit w-full flex-col items-start bg-gray-100 p-8 pb-[5.25rem] md:flex-row">
          <div
            className="mx-auto aspect-square h-64 rounded bg-cover object-cover md:mx-0"
            style={{ backgroundImage: `url(${track?.album?.image})` }}
          />
          <div className="mt-4 overflow-hidden md:mt-0 md:h-64 md:px-8">
            <h1 className="text-4xl font-bold tracking-wide">{track.name}</h1>
            <h2 className="text-xl font-light">
              {track.artists.map(({ name }) => name).join(", ")}
            </h2>
            <ScrollArea className="md:h-44">
              <p className="text-md mt-4">{track.wikiDescription}</p>
            </ScrollArea>
          </div>
        </div>
        <div className="flex flex-1 flex-col items-center justify-start p-10 md:p-4">
          <div className="grid w-full flex-1 grid-cols-1 gap-x-2 gap-y-4 sm:grid-cols-2 md:grid-cols-3">
            <div className="flex flex-col items-start justify-start">
              <h3 className="text-xl font-semibold">Álbum</h3>
              <p className="text-md font-light">{track.album?.title}</p>
            </div>
            <div className="flex flex-col items-start justify-start">
              <h3 className="text-xl font-semibold">
                Total de discos en álbum
              </h3>
              <p className="text-md font-light">{track.album?.totalTracks}</p>
            </div>
            <div className="flex flex-col items-start justify-start">
              <h3 className="text-xl font-semibold">
                Fecha de lanzamiento del álbum
              </h3>
              <p className="text-md font-light">
                {dayjs(track.album?.releaseDate).format("LL")}
              </p>
            </div>
            <div className="flex flex-col items-start justify-start">
              <h3 className="text-xl font-semibold">Cantidad de artistas</h3>
              <p className="text-md font-light">{track.artists?.length}</p>
            </div>
            <div className="flex flex-col items-start justify-start">
              <h3 className="text-xl font-semibold">Duración</h3>
              <p className="text-md font-light">
                {dayjs.duration(track.duration).format("mm:ss")}
              </p>
            </div>
            <div className="flex flex-col items-start justify-start">
              <h3 className="text-xl font-semibold">Fecha de lanzamiento</h3>
              <p className="text-md font-light">
                {dayjs(track.releaseDate).format("LL")}
              </p>
            </div>
            <div className="flex flex-col items-start justify-start">
              <h3 className="text-xl font-semibold">
                ¿Tiene contenido explícito?
              </h3>
              <p className="text-md font-light">
                {track.explicit ? "Sí" : "No"}
              </p>
            </div>
            <div className="flex flex-col items-start justify-start">
              <h3 className="text-xl font-semibold">Oyentes mensuales</h3>
              <p className="text-md font-light">
                {track.listeners?.toLocaleString()}
              </p>
            </div>
            <div className="flex flex-col items-start justify-start">
              <h3 className="text-xl font-semibold">Reproducciones totales</h3>
              <p className="text-md font-light">
                {track.playCount?.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default TrackPage;
