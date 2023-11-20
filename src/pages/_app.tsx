import {
  type Session,
  createPagesBrowserClient,
} from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { type AppType } from "next/app";

import { api } from "@utils/api";

import "@styles/globals.css";
import { useState } from "react";
import { Toaster } from "@components/ui/toaster";

const MyApp: AppType<{ initialSession: Session }> = ({
  Component,
  pageProps,
}) => {
  // Create a new supabase browser client on every first render.
  const [supabaseClient] = useState(() => createPagesBrowserClient());

  return (
    <SessionContextProvider
      supabaseClient={supabaseClient}
      initialSession={pageProps.initialSession}
    >
      <Component {...pageProps} />
      <Toaster />
    </SessionContextProvider>
  );
};

export default api.withTRPC(MyApp);
