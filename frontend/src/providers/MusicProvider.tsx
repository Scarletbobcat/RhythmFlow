import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useMemo,
  useCallback,
} from "react";
import Song from "src/types/Song";

interface MusicContextType {
  currentSong: Song | null;
  isPlaying: boolean;
  playlist: Song[];
  setPlaylist: (playlist: Song[]) => void;
  isLastSong: () => boolean;
  isFirstSong: () => boolean;
  setCurrentSong: (song: Song) => void;
  togglePlayPause: () => void;
  playNext: () => void;
  playPrevious: () => void;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export const MusicProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playlist, setPlaylist] = useState<Song[]>([]);

  console.log("Playlist: ", playlist);

  const togglePlayPause = useCallback(() => {
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  const isFirstSong = useCallback(() => {
    if (!currentSong || playlist.length === 0) return false;

    const currentIndex = playlist.findIndex(
      (song) => song.id === currentSong.id
    );
    return currentIndex === 0;
  }, [currentSong, playlist]);

  const isLastSong = useCallback(() => {
    if (!currentSong || playlist.length === 0) return false;

    const currentIndex = playlist.findIndex(
      (song) => song.id === currentSong.id
    );
    return currentIndex === playlist.length - 1;
  }, [currentSong, playlist]);

  const playNext = useCallback(() => {
    if (!currentSong || playlist.length === 0) return;

    const currentIndex = playlist.findIndex(
      (song) => song.id === currentSong.id
    );

    if (currentIndex === playlist.length - 1) return;

    const nextIndex = (currentIndex + 1) % playlist.length;
    setCurrentSong(playlist[nextIndex]);
  }, [currentSong, playlist]);

  const playPrevious = useCallback(() => {
    if (!currentSong || playlist.length === 0) return;

    const currentIndex = playlist.findIndex(
      (song) => song.id === currentSong.id
    );

    if (currentIndex === 0) return;

    const prevIndex = (currentIndex - 1 + playlist.length) % playlist.length;
    setCurrentSong(playlist[prevIndex]);
  }, [currentSong, playlist]);

  return (
    <MusicContext.Provider
      value={useMemo(
        () => ({
          currentSong,
          isPlaying,
          playlist,
          setPlaylist,
          isLastSong,
          isFirstSong,
          setCurrentSong: (song) => {
            setCurrentSong(song);
            setIsPlaying(true);
          },
          togglePlayPause,
          playNext,
          playPrevious,
        }),
        [
          currentSong,
          isPlaying,
          playlist,
          setPlaylist,
          togglePlayPause,
          playNext,
          playPrevious,
          isLastSong,
          isFirstSong,
        ]
      )}
    >
      {children}
    </MusicContext.Provider>
  );
};

// eslint-disable-next-line
export const useMusic = () => {
  const context = useContext(MusicContext);
  if (context === undefined) {
    throw new Error("useMusic must be used within a MusicProvider");
  }
  return context;
};
