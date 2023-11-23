import Head from "next/head";
import Image from "next/image";

import { api } from "@utils/api";
import { Input } from "@components/ui/input";
import { useDebounce } from "@hooks/useDebounce";
import { useState } from "react";
import { ScrollArea } from "@components/ui/scroll-area";

export default function Home() {
  const [queryString, setQueryString] = useState("");
  const query = useDebounce(queryString, 500);

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
      <main className="flex min-h-screen flex-col items-center justify-center">
        <h1 className="mt-32 text-5xl font-semibold">Conocé tu música</h1>

        <Input
          className="mb-10 mt-12 max-w-lg text-xl"
          onChange={(event) => {
            setQueryString(event.target.value);
          }}
          placeholder="Buscá tu canción favorita..."
        />
        <ScrollArea className="h-48 w-full px-8">
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
