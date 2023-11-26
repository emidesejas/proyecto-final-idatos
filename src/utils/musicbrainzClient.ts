import axios from "axios";
import applyCaseMiddleware from "axios-case-converter";

const musicbrainzClient = applyCaseMiddleware(
  axios.create({
    baseURL: "https://musicbrainz.org/ws/2/",
    validateStatus: () => true,
  }),
);

type MusicbrainzISRCResponse = {
  recordings: {
    id: string;
    firstReleaseDate: string;
    isrcs: string[];
    video: boolean;
    disambiguation: string; // "explicit" ...
    length: number;
    title: string;
  }[];
  isrc: string;
};

export const getMusicbrainzId = async (isrc: string) => {
  const { data } = await musicbrainzClient.get<MusicbrainzISRCResponse>(
    `isrc/${isrc}?inc=artists+isrcs&fmt=json`,
  );

  console.log("musicbrainz data", data);

  return data.recordings[0]?.id ?? null;
};
