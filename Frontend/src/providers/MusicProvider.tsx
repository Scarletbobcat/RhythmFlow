import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useMemo,
  useCallback,
} from "react";
import Song from "src/types/Song";

interface MusicContextType {
  currentSong: Song | null;
  isPlaying: boolean;
  playlist: Song[];
  isLastSong: () => boolean;
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

  const togglePlayPause = useCallback(() => {
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

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
    const nextIndex = (currentIndex + 1) % playlist.length;
    setCurrentSong(playlist[nextIndex]);
  }, [currentSong, playlist]);

  const playPrevious = useCallback(() => {
    if (!currentSong || playlist.length === 0) return;

    const currentIndex = playlist.findIndex(
      (song) => song.id === currentSong.id
    );
    const prevIndex = (currentIndex - 1 + playlist.length) % playlist.length;
    setCurrentSong(playlist[prevIndex]);
  }, [currentSong, playlist]);

  // Function to fetch songs from API
  const fetchSongs = async () => {
    const token = JSON.parse(
      localStorage.getItem("sb-emvtnpvqsjljsrkzmwwp-auth-token") ?? "{}"
    ).access_token;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/music/songs`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        const tempData = [
          ...data,
          // ...data.map((song: Song) => ({ ...song, id: `${song.id}-dup1` })),
          // ...data.map((song: Song) => ({ ...song, id: `${song.id}-dup2` })),
          // ...data.map((song: Song) => ({ ...song, id: `${song.id}-dup3` })),
          // ...data.map((song: Song) => ({ ...song, id: `${song.id}-dup4` })),
        ];
        setPlaylist(tempData);
      }
    } catch (error) {
      console.error("Failed to fetch songs", error);
    }
  };

  // Fetch songs on mount
  useEffect(() => {
    fetchSongs();
  }, []);

  return (
    <MusicContext.Provider
      value={useMemo(
        () => ({
          currentSong,
          isPlaying,
          playlist,
          isLastSong,
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
          togglePlayPause,
          playNext,
          playPrevious,
          isLastSong,
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
