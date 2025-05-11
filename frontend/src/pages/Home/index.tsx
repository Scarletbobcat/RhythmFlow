import { useMusic } from "src/providers/MusicProvider";
import Carousel from "src/components/Carousel";
import ScrollableContainer from "src/components/ScrollableContainer";
import { getSongs } from "src/api/songs";
import { useEffect } from "react";
import Song from "src/types/Song";

function Home() {
  const { playlist, setPlaylist } = useMusic();

  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        const data = await getSongs();
        const tempData = [
          ...data,
          ...data.map((song: Song) => ({
            ...song,
            id: song.id + "duplicate-1",
          })),
        ];
        setPlaylist(tempData);
      } catch (error) {
        console.error("Failed to fetch playlist", error);
      }
    };

    fetchPlaylist();
  }, [setPlaylist]);

  return (
    <div className="bg-neutral-900 rounded-lg h-full p-10 flex select-none">
      <ScrollableContainer>
        <p className="text-3xl font-bold select-none mb-2">Home</p>
        <div className="flex flex-col gap-4">
          <Carousel songs={playlist} title="Trending" />
          <Carousel songs={playlist} title="For you" />
        </div>
      </ScrollableContainer>
    </div>
  );
}

export default Home;
