import { env } from "@env.mjs";
import axios from "axios";
import applyCaseMiddleware from "axios-case-converter";

const spotifyAccountsClient = applyCaseMiddleware(
  axios.create({
    baseURL: "https://accounts.spotify.com/api",
    validateStatus: () => true,
  }),
);

const spotifyClient = applyCaseMiddleware(
  axios.create({
    baseURL: "https://api.spotify.com/v1",
    validateStatus: () => true,
  }),
);

type GenerateTokenResponse = {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
};

const getSpotifyToken = async () => {
  const params = new URLSearchParams();
  params.append("grant_type", "client_credentials");
  params.append("client_id", env.SPOTIFY_CLIENT_ID);
  params.append("client_secret", env.SPOTIFY_CLIENT_SECRET);
  const { data } = await spotifyAccountsClient.post<GenerateTokenResponse>(
    `/token`,
    params,
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    },
  );

  console.log("🔑 Spotify token generated: ", data.accessToken);
  return data;
};

type TrackObject = {
  album: any;
  artists: any[];
  availableMarkets: string[];
  discNumber: number;
  durationMs: number;
  explicit: boolean;
  externalIds: {
    isrc: string;
    ean: string;
    upc: string;
  };
  externalUrls: {
    spotify: string;
  };
  href: string;
  id: string;
  isPlayable: boolean;
  name: string;
  popularity: number;
  previewUrl: string | null;
  trackNumber: number;
  type: "track";
  uri: string;
  isLocal: boolean;
};

type SearchResponse = {
  tracks: {
    href: string;
    limit: number;
    next: string | null;
    offset: number;
    previous: string | null;
    total: number;
    items: TrackObject[];
  };
};

export const search = async (text: string) => {
  const { accessToken } = (await getSpotifyToken()) ?? {};

  if (!accessToken) {
    console.log("❌ No access token");
    return null;
  }

  const { data } = await spotifyClient.get<SearchResponse>("search", {
    params: {
      q: text,
      type: "track",
    },
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return data;
};
