import { spotifyRouter } from "@server/api/routers/spotify";
import { tracksRouter } from "@server/api/routers/tracks";
import { createTRPCRouter } from "@server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  spotify: spotifyRouter,
  tracks: tracksRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
