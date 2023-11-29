import axios from "axios";
import applyCaseMiddleware from "axios-case-converter";

const lastFmClient = applyCaseMiddleware(
  axios.create({
    baseURL: "http://ws.audioscrobbler.com/2.0/",
    validateStatus: () => true,
    params: {
      api_key: process.env.LASTFM_API_KEY,
      format: "json",
    },
  }),
);

type TrackGetInfoResponse = {
  track: {
    name: string;
    mbid: string;
    url: string;
    duration: string;
    streamable: {
      fulltrack: string;
      streamable: string;
    };
    listeners: string;
    playcount: string;
    artist: {
      name: string;
      mbid: string;
      url: string;
    };
    album: {
      artist: string;
      title: string;
      mbid: string;
      url: string;
      image: {
        text: string;
        size: string;
      }[];
    };
    toptags: {
      tag: {
        name: string;
        url: string;
      }[];
    };
    wiki: {
      published: string;
      summary: string;
      content: string;
    };
  };
};

type TrackSearchResponse = {
  results: {
    openSearchQuery: {
      text: string;
      role: string;
      startPage: string;
    };
    opensearchTotalResults: string;
    opensearchStartIndex: string;
    opensearchItemsPerPage: string;
    trackmatches: {
      track: {
        name: string;
        artist: string;
        url: string;
        streamable: string;
        listeners: string;
        image: {
          text: string;
          size: string;
        }[];
        mbid: string;
      }[];
    };
  };
};

export const getLastFmTrackData = async (musicbrainzId: string) => {
  const { data } = await lastFmClient.get<TrackGetInfoResponse>("", {
    params: {
      method: "track.getInfo",
      mbid: musicbrainzId,
    },
  });

  if ("error" in data) {
    console.log("Could not get data from last fm for track:", musicbrainzId);
    return null;
  }

  return data;
};

export const searchLastFm = async (query: string) => {
  const { data } = await lastFmClient.get<TrackSearchResponse>("", {
    params: {
      method: "track.search",
      track: query,
    },
  });

  if ("error" in data) {
    console.log("Could not search from last fm for query:", query);
    return null;
  }

  return data;
};
