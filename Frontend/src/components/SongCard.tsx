import { useMusic } from "src/providers/MusicProvider";
import { MdPlayArrow, MdPause } from "react-icons/md";
import Song from "src/types/Song";

const SongCard = ({ id, title, artist, songUrl, imageUrl }: Song) => {
  const { setCurrentSong, currentSong, isPlaying, togglePlayPause } =
    useMusic();

  const isCurrentlyPlaying = currentSong?.id === id && isPlaying;

  const handlePlayClick = () => {
    if (currentSong?.id === id) {
      togglePlayPause();
    } else {
      setCurrentSong({ id, title, artist, songUrl, imageUrl });
    }
  };

  return (
    <div className="relative group flex flex-col items-center justify-center rounded-md overflow-hidden gap-x-4 hover:bg-neutral-800 transition p-3">
      <div className="relative aspect-square w-full h-full rounded-md overflow-hidden">
        <img
          src={imageUrl ?? "/default-album.jpg"}
          alt={`${title} cover`}
          className="w-full aspect-square object-cover rounded-md"
        />
        <button
          onClick={handlePlayClick}
          className="absolute bottom-2 right-2 bg-violet-500 hover:bg-violet-400 hover:scale-110 transition cursor-pointer rounded-full p-2"
        >
          {isCurrentlyPlaying ? (
            <MdPause size={30} />
          ) : (
            <MdPlayArrow size={30} />
          )}
        </button>
      </div>
      <div className="flex flex-col items-start w-full p-4 gap-y-1">
        <p className="font-semibold truncate w-full text-white">{title}</p>
        <p className="text-neutral-400 text-sm w-full truncate">{artist}</p>
      </div>
    </div>
  );
};

export default SongCard;
