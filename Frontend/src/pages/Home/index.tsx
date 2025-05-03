import { useMusic } from "src/providers/MusicProvider";
import Carousel from "src/components/Carousel";
import ScrollableContainer from "src/components/ScrollableContainer";

function Home() {
  const { playlist } = useMusic();

  return (
    <div className="bg-neutral-900 rounded-lg h-full flex select-none">
      <ScrollableContainer>
        <div className="flex flex-col gap-4">
          <Carousel songs={playlist} title="Trending" />
          <Carousel songs={playlist} title="For you" />
        </div>
      </ScrollableContainer>
    </div>
  );
}

export default Home;
