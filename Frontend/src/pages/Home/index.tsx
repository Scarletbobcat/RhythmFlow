import { useMusic } from "src/providers/MusicProvider";
import SongCard from "src/components/SongCard";

function Home() {
  const { playlist } = useMusic();

  return (
    <div className="bg-neutral-900 rounded-lg p-10 h-full overflow-auto">
      <p className="font-semibold text-xl">Trending</p>
      <div className="flex gap-4">
        {playlist.map((song) => (
          <SongCard
            key={song.id}
            id={song.id}
            title={song.title}
            artist={song.artist}
            songUrl={song.songUrl}
            imageUrl={song.imageUrl}
          />
        ))}
      </div>
    </div>
  );
}

export default Home;
