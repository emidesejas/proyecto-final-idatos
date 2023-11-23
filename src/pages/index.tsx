import Head from "next/head";
import Image from "next/image";

import { api } from "@utils/api";
import { Input } from "@components/ui/input";
import { useDebounce } from "@hooks/useDebounce";
import { useState } from "react";
import { ScrollArea } from "@components/ui/scroll-area";
import { Button } from "@components/ui/button";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useToast } from "@components/ui/use-toast";
import { useRouter } from "next/router";

export default function Home() {
  const [queryString, setQueryString] = useState("");
  const supabase = useSupabaseClient();
  const query = useDebounce(queryString, 500);
  const { toast } = useToast();
  const router = useRouter();

  const { data } = api.spotify.search.useQuery(
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

        <Input
          className="mt-9 max-w-lg text-xl"
          onChange={(event) => {
            setQueryString(event.target.value);
          }}
          placeholder="Buscá tu canción favorita..."
        />
        <ScrollArea className="mt-10 w-full flex-1 px-8">
          {data?.tracks.items.map(
            ({
              id,
              name,
              artists: [{ name: artistName }],
              album: {
                images: [{ url }],
              },
            }) => (
              <div key={id} className="mt-2 flex h-12 flex-row gap-2">
                <img
                  className="aspect-square h-full rounded object-cover"
                  src={url}
                  alt="pepito"
                />
                {/* <Image src={url} alt={"pepito"} height={20} width={20} /> */}
                <div className="flex flex-col">
                  <h2 className="font-bold">{name}</h2>
                  <h3 className="font-light">{artistName}</h3>
                </div>
              </div>
            ),
          )}
        </ScrollArea>
      </main>
    </>
  );
}
