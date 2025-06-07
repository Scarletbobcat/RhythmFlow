import { useMusic } from "src/providers/MusicProvider";
import { MdPlayArrow, MdPause } from "react-icons/md";
import Song from "src/types/Song";

interface SongCardProps {
  song: Song;
  setPlaylist?: () => void;
}

const SongCard = ({ song, setPlaylist }: SongCardProps) => {
  const { setCurrentSong, currentSong, isPlaying, togglePlayPause } =
    useMusic();

  const isCurrentlyPlaying = currentSong?.id === song.id && isPlaying;

  const handlePlayClick = () => {
    if (currentSong?.id === song.id) {
      togglePlayPause();
    } else {
      if (setPlaylist) {
        setPlaylist();
      }
      setCurrentSong(song);
    }
  };

  return (
    <div className="relative group/card flex flex-col items-center justify-center rounded-md overflow-hidden h-full hover:bg-neutral-800 transition p-3 w-50">
      <div className="relative aspect-square w-full rounded-md overflow-hidden">
        <img
          src={
            song.imageUrl ??
            "https://pub-26db48d1379b499ba8a2bdeb7c0975dc.r2.dev/default-album.png"
          }
          alt={`${song.title} cover`}
          className="w-full aspect-square object-cover rounded-md"
        />
        <button
          onClick={handlePlayClick}
          className="opacity-0 group-hover/card:opacity-100 translate-y-2 group-hover/card:translate-y-0 absolute bottom-2 right-2 bg-violet-500 hover:bg-violet-400 hover:scale-110 transition cursor-pointer rounded-full p-2"
        >
          {isCurrentlyPlaying ? (
            <MdPause size={30} />
          ) : (
            <MdPlayArrow size={30} />
          )}
        </button>
      </div>
      <div className="flex flex-col items-start w-full gap-y-1 pt-2">
        <p className="font-semibold truncate w-full text-white">{song.title}</p>
        <p className="text-neutral-400 text-sm w-full truncate">
          {song.artistName}
        </p>
      </div>
    </div>
  );
};

export default SongCard;
