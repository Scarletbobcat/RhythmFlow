import { useMusic } from "src/providers/MusicProvider";
import Carousel from "src/components/Carousel";
import ScrollableContainer from "src/components/ScrollableContainer";
import { useEffect } from "react";
import { getSongs } from "src/api/songs";
import { useQuery } from "@tanstack/react-query";

function Home() {
  const { setPlaylist } = useMusic();
  // const [songs, setSongs] = useState<Song[]>([]);

  // useEffect(() => {
  //   const fetchPlaylist = async () => {
  //     try {
  //       const data = await getSongs();
  //       setSongs(data);
  //     } catch (error) {
  //       console.error("Failed to fetch playlist", error);
  //     }
  //   };

  //   fetchPlaylist();
  // }, [setPlaylist]);

  const {
    data: songs,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["playlist"],
    queryFn: getSongs,
  });

  useEffect(() => {
    if (isLoading) return;
    if (error) {
      console.error("Error fetching playlist:", error);
      return;
    }
    if (songs) {
      setPlaylist(songs);
    }
  }, [setPlaylist, songs, isLoading, error]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <ScrollableContainer className="bg-neutral-900 rounded-lg h-full flex flex-col select-none">
      <div className="p-10">
        <p className="text-5xl font-bold select-none mb-10">Home</p>
        <div className="flex flex-col gap-y-6">
          <Carousel songs={songs} title="Trending" />
          <Carousel songs={songs} title="For you" />
        </div>
      </div>
    </ScrollableContainer>
  );
}

export default Home;
