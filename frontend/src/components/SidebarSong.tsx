import { IoVolumeHigh } from "react-icons/io5";
import { MdPause, MdPlayArrow } from "react-icons/md";
import Song from "src/types/Song";

interface UsersSongsProps {
  song: Song;
  currentSong: Song | null;
  isPlaying: boolean;
  setCurrentSong: (song: Song) => void;
  togglePlayPause: () => void;
  setPlaylist?: () => void;
}

function UsersSong({
  song,
  currentSong,
  setPlaylist,
  isPlaying,
  setCurrentSong,
  togglePlayPause,
}: UsersSongsProps) {
  const isCurrentlyPlaying = currentSong?.id === song.id && isPlaying;

  const handlePlayClick = () => {
    if (currentSong?.id === song.id) {
      togglePlayPause();
    } else {
      if (setPlaylist) setPlaylist();
      setCurrentSong(song);
    }
  };

  return (
    <div
      key={song.id}
      className="p-2 hover:bg-neutral-800 rounded-md flex h-15 items-center gap-x-2 cursor-pointer group/playlist"
    >
      <div className="relative h-full">
        <img
          src={
            song.imageUrl ??
            "https://pub-26db48d1379b499ba8a2bdeb7c0975dc.r2.dev/default-album.png"
          }
          alt={song.title}
          className="w-full aspect-square object-contain rounded-md group min-w-10 max-w-10"
        />
        <button
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover/playlist:opacity-100 transition cursor-pointer hover:scale-110"
          onClick={handlePlayClick}
        >
          {isCurrentlyPlaying ? (
            <MdPause size={30} />
          ) : (
            <MdPlayArrow size={30} />
          )}
        </button>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex flex-col p-2 max-w-35 w-35">
          <p className="truncate font-medium text-sm">{song.title}</p>
          <p className="truncate text-neutral-400 text-xs">{song.artistName}</p>
        </div>
        {isCurrentlyPlaying && (
          <IoVolumeHigh size={24} className="text-violet-500" />
        )}
      </div>
    </div>
  );
}

export default UsersSong;
