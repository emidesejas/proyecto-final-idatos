import { useRouter } from "next/router";

const TrackPage = () => {
  const { query } = useRouter();

  return <div>{query.id}</div>;
};

export default TrackPage;
