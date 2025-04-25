import { useMusic } from "src/providers/MusicProvider";
import Carousel from "src/components/Carousel";

function Home() {
  const { playlist } = useMusic();

  return (
    <div className="bg-neutral-900 rounded-lg py-10 h-full overflow-y-auto">
      <div className="flex flex-col gap-4 overflow-auto">
        <Carousel songs={playlist} title="Trending" />
        <Carousel songs={playlist} title="For you" />
      </div>
    </div>
  );
}

export default Home;
