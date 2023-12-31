import { env } from "@env.mjs";
import axios from "axios";
import applyCaseMiddleware from "axios-case-converter";
import { db } from "@server/db";

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
  const tokenData = await db.tokens.findFirst({
    where: { service: "spotify" },
    orderBy: { validUntil: "desc" },
  });

  if (tokenData && tokenData.validUntil > new Date()) {
    console.log("🔑 Spotify token found in database");
    return tokenData.token;
  }

  console.log("❌ Spotify token not found in database");
  console.log("🔑 Generating token for Spotify");

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

  await db.tokens.create({
    data: {
      type: "Bearer",
      token: data.accessToken,
      service: "spotify",
      validUntil: new Date(Date.now() + data.expiresIn * 1000),
    },
  });

  return data.accessToken;
};

export type TrackObject = {
  album: {
    albumType: string;
    artists: {
      externalUrls: {
        spotify: string;
      };
      href: string;
      id: string;
      name: string;
      type: "artist";
      uri: string;
    }[];
    availableMarkets: string[];
    externalUrls: {
      spotify: string;
    };
    href: string;
    id: string;
    images: {
      height: number;
      url: string;
      width: number;
    }[];
    name: string;
    releaseDate: string;
    releaseDatePrecision: string;
    totalTracks: number;
    type: "album";
    uri: string;
  };
  artists: {
    externalUrls: {
      spotify: string;
    };
    followers: {
      href: string;
      total: number;
    };
    genres: string[];
    href: string;
    id: string;
    images?: [
      {
        url: string;
        height: number;
        width: number;
      },
    ];
    name: string;
    popularity: number;
    type: "artist";
    uri: string;
  }[];
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
  const accessToken = await getSpotifyToken();

  if (!accessToken) {
    console.log("❌ No access token");
    return null;
  }

  const { data, status } = await spotifyClient.get<SearchResponse>("search", {
    params: {
      q: text,
      type: "track",
    },
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (status !== 200) {
    console.log("❌ Spotify search failed with status", status);
    return null;
  }

  return data;
};

export const getTrack = async (trackId: string) => {
  const accessToken = await getSpotifyToken();

  if (!accessToken) {
    console.log("❌ No access token");
    return null;
  }

  const { data, status } = await spotifyClient.get<TrackObject>(
    `tracks/${trackId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  if (status !== 200) {
    console.log(
      `❌ Spotify getTrack for id: ${trackId} failed with status: ${status}`,
    );
    return null;
  }

  return data;
};
