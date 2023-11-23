import Head from "next/head";
import Image from "next/image";

import { api } from "@utils/api";
import { Input } from "@components/ui/input";
import { useDebounce } from "@hooks/useDebounce";
import { useRef, useState } from "react";
import { ScrollArea } from "@components/ui/scroll-area";
import { Button } from "@components/ui/button";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useToast } from "@components/ui/use-toast";
import { useRouter } from "next/router";
import { TrackCard } from "@components/TrackCard";
import SpotifyLogo from "@images/spotify.png";
import { X } from "lucide-react";

import { Bars } from "react-loader-spinner";

export default function Home() {
  const [queryString, setQueryString] = useState("");
  const supabase = useSupabaseClient();
  const query = useDebounce(queryString, 500);
  const { toast } = useToast();
  const router = useRouter();

  const inputRef = useRef<HTMLInputElement>(null);

  const { data, isFetching } = api.spotify.search.useQuery(
    { text: query },
    {
      enabled: !!query,
      refetchOnWindowFocus: false,
      keepPreviousData: !!query,
    },
  );

  return (
    <>
      <Head>
        <title>Conocé tu música</title>
        <meta
          name="description"
          content="Proyecto final de Integración de Datos"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex h-screen flex-col items-center justify-center">
        <div className="flex w-full justify-between bg-gray-100 p-4">
          <Button
            variant="link"
            className="ml-auto h-5 p-0"
            onClick={async () => {
              const { error } = await supabase.auth.signOut();

              if (!error) {
                await router.replace("/sign-in");
                toast({
                  title: "¡Hasta luego!",
                  description: "Esperamos verte pronto",
                });
                return;
              }

              toast({
                variant: "destructive",
                title: "Error",
                description: error.message,
              });
            }}
          >
            Logout
          </Button>
        </div>
        <h1 className="mt-32 text-5xl font-semibold">Conocé tu música</h1>

        <div className="mt-9 flex w-full max-w-lg flex-row items-center">
          <Input
            ref={inputRef}
            className="text-xl"
            onChange={(event) => {
              setQueryString(event.target.value);
            }}
            placeholder="Buscá tu canción favorita..."
          />
          {isFetching ? (
            <Bars width={32} height={32} color="" wrapperClass="ml-2" />
          ) : (
            <X
              className="ml-2 h-8 w-8 cursor-pointer"
              onClick={() => {
                if (inputRef.current) inputRef.current.value = "";
                setQueryString("");
              }}
            />
          )}
        </div>

        <div className="mt-2 flex flex-row items-center justify-center">
          <h3 className="text-sm font-light">
            Resultados obtenidos a través de
          </h3>
          <Image
            src={SpotifyLogo}
            alt={"Spotify Logo"}
            height={20}
            objectFit="contain"
            className="ml-2"
          />
        </div>
        <ScrollArea className="mt-4 w-full max-w-xl flex-1 px-3">
          {data?.tracks.items.map((track) => (
            <TrackCard track={track} key={track.id} />
          ))}
        </ScrollArea>
      </main>
    </>
  );
}
