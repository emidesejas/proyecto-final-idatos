import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@server/api/trpc";
import { search } from "@utils/spotifyClient";

export const spotifyRouter = createTRPCRouter({
  search: protectedProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input: { text } }) => search(text)),
});
