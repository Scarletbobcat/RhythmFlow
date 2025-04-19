import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import { useMusic } from "src/providers/MusicProvider";
import {
  MdSkipPrevious,
  MdSkipNext,
  MdPlayArrow,
  MdPause,
} from "react-icons/md";
import Song from "src/types/Song";

interface AudioPlayerProps {
  song: Song;
  onPrev?: () => void;
  onNext?: () => void;
}

const AudioPlayer = ({ song, onPrev, onNext }: AudioPlayerProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const { isPlaying, togglePlayPause } = useMusic();
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isReady, setIsReady] = useState(false);

  // Track the current HLS instance
  const hlsRef = useRef<Hls | null>(null);

  // Load audio source with HLS.js
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !song.songUrl) return;

    // Reset ready state when source changes
    setIsReady(false);

    // Clean up previous HLS instance if it exists
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    if (Hls.isSupported()) {
      const hls = new Hls();
      hlsRef.current = hls;

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setIsReady(true);
      });

      hls.on(Hls.Events.ERROR, (_event, data) => {
        console.error("HLS error:", data);
      });

      hls.loadSource(song.songUrl);
      hls.attachMedia(audio);
    } else if (audio.canPlayType("application/vnd.apple.mpegurl")) {
      audio.src = song.songUrl;
      audio.addEventListener("canplay", () => setIsReady(true));
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [song]);

  // Handle play/pause state
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !isReady) return;

    // Only attempt to play when the media is ready
    if (isPlaying) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.error("Playback failed:", error);
          // Only toggle if the error isn't due to interrupted request
          if (error.name !== "AbortError") {
            togglePlayPause();
          }
        });
      }
    } else {
      audio.pause();
    }
  }, [isPlaying, isReady, togglePlayPause]);

  // Update current time and duration
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
    };
  }, []);

  // Play/Pause handler
  const togglePlay = () => {
    togglePlayPause();
  };

  // Seek handler
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    const time = Number(e.target.value);
    audio.currentTime = time;
    setCurrentTime(time);
  };

  // Volume handler
  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    const vol = Number(e.target.value);
    audio.volume = vol;
    setVolume(vol);
  };

  // Format time helper
  const formatTime = (time: number) =>
    isNaN(time)
      ? "0:00"
      : `${Math.floor(time / 60)}:${String(Math.floor(time % 60)).padStart(2, "0")}`;

  return (
    <div className="fixed bottom-0 left-0 w-full bg-neutral-900 flex flex-col p-4 shadow-lg z-50">
      <audio ref={audioRef} style={{ display: "none" }} />
      {/* Main row with 3 equal columns and center alignment */}
      <div className="grid grid-cols-3 gap-x-2 items-center">
        {/* Song info - Left aligned */}
        <div className="flex flex-row">
          <img
            src={song.imageUrl ? song.imageUrl : "/default-album.jpg"}
            alt="Art"
            className="w-16 h-16 rounded-md"
          />
          <div className="flex flex-col items-start p-4 gap-y-1">
            <p className="font-semibold truncate w-full text-white">
              {song.title}
            </p>
            <p className="text-neutral-400 text-sm w-full truncate">
              {song.artist}
            </p>
          </div>
        </div>

        {/* Playback - Center aligned */}
        <div className="flex justify-center items-center flex-col">
          <div className="flex flex-row gap-x-4">
            <button
              onClick={onPrev}
              className="text-white p-2 cursor-pointer hover:scale-110 transition hover:bg-neutral-600 rounded-full"
              disabled={!onPrev}
            >
              <MdSkipPrevious size={24} />
            </button>
            <button
              onClick={togglePlay}
              className="text-white p-2 cursor-pointer hover:scale-110 transition hover:bg-neutral-600 rounded-full"
              disabled={!isReady}
            >
              {isPlaying ? <MdPause size={24} /> : <MdPlayArrow size={24} />}
            </button>
            <button
              onClick={onNext}
              className="text-white p-2 cursor-pointer hover:scale-110 transition hover:bg-neutral-600 rounded-full"
              disabled={!onNext}
            >
              <MdSkipNext size={24} />
            </button>
          </div>
          {/* Progress bar */}
          <div className="flex flex-col justify-center items-center w-full px-8">
            <div className="flex items-center w-full gap-x-2 mt-1">
              <span className="text-white text-xs">
                {formatTime(currentTime)}
              </span>
              <input
                type="range"
                min={0}
                max={duration || 0}
                value={currentTime}
                onChange={handleSeek}
                className="flex-grow"
              />
              <span className="text-white text-xs">{formatTime(duration)}</span>
            </div>
          </div>
        </div>

        {/* Volume - Right aligned */}
        <div className="flex justify-end">
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={handleVolume}
            className="w-24"
          />
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;
