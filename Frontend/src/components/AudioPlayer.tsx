import { useEffect, useRef, useState } from "react";
import Slider from "./Slider";
import Hls from "hls.js";
import { useMusic } from "src/providers/MusicProvider";
import { IoVolumeHigh } from "react-icons/io5";
import { IoMdVolumeOff } from "react-icons/io";
import {
  MdSkipPrevious,
  MdSkipNext,
  MdPlayArrow,
  MdPause,
} from "react-icons/md";
import Song from "src/types/Song";

interface AudioPlayerProps {
  song?: Song;
  onPrev?: () => void;
  onNext?: () => void;
}

const AudioPlayer = ({ song, onPrev, onNext }: AudioPlayerProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const { isPlaying, togglePlayPause, isLastSong } = useMusic();
  const [currentTime, setCurrentTime] = useState([0]);
  const [isSeeking, setIsSeeking] = useState(false);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState([1]);
  const [previousVolume, setPreviousVolume] = useState([1]);
  const [isReady, setIsReady] = useState(false);

  // Track the current HLS instance
  const hlsRef = useRef<Hls | null>(null);

  // Load audio source with HLS.js
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !song?.songUrl || !song) return;

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

  // Handle next song on song end
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => {
      if (isLastSong()) {
        togglePlayPause();
      } else {
        onNext?.();
      }
    };

    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("ended", handleEnded);
    };
  }, [onNext, isLastSong, togglePlayPause]);

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

  // updates the current time and duration of the audio
  // this effect runs when the song changes or the audio element is ready
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateDuration = () => {
      if (!isNaN(audio.duration) && audio.duration > 0) {
        setDuration(audio.duration);
      }
    };

    const updateTime = () => {
      if (audio.currentTime > 0 && !isSeeking) {
        setCurrentTime([audio.currentTime]);
      }
    };

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("durationchange", updateDuration);

    return () => {
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("durationchange", updateDuration);
      audio.removeEventListener("timeupdate", updateTime);
    };
  }, [song, isReady, isSeeking]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Set the volume when the component mounts
    audio.volume = volume[0];

    // Cleanup function to reset volume when component unmounts
    return () => {
      audio.volume = 1; // Reset to default volume
    };
  }, [volume]);

  if (!song) {
    return null;
  }

  const handleSeekCommit = (value: number[]) => {
    const audio = audioRef.current;
    if (!audio) return;
    const time = value[0];
    audio.currentTime = time;
    setCurrentTime(value);
    setIsSeeking(false);
  };

  // Seek handler
  const handleSeek = (value: number[]) => {
    setCurrentTime(value);
  };

  // Volume handler
  const handleVolume = (value: number[]) => {
    const audio = audioRef.current;
    if (!audio) return;
    const vol = value[0];
    audio.volume = vol;
    setVolume(value);
  };

  // Format time helper
  const formatTime = (time: number) =>
    isNaN(time)
      ? "0:00"
      : `${Math.floor(time / 60)}:${String(Math.floor(time % 60)).padStart(2, "0")}`;

  return (
    <div className="h-30 w-full flex flex-col px-10 py-4 z-50 bg-black">
      <audio ref={audioRef} style={{ display: "none" }} />
      {/* Main row with 3 equal columns and center alignment */}
      <div className="grid grid-cols-3 gap-x-2 items-center">
        {/* Song info - Left aligned */}
        <div className="flex flex-row">
          <img
            src={
              song.imageUrl ??
              "https://pub-26db48d1379b499ba8a2bdeb7c0975dc.r2.dev/default-album.png"
            }
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
        <div className="flex justify-center items-center flex-col gap-y-2">
          <div className="flex flex-row gap-x-4">
            <button
              onClick={onPrev}
              className="text-white p-2 cursor-pointer hover:scale-110 transition hover:bg-neutral-600 rounded-full"
              disabled={!onPrev}
            >
              <MdSkipPrevious size={24} />
            </button>
            <button
              onClick={togglePlayPause}
              className="text-black p-2 cursor-pointer hover:scale-110 transition rounded-full bg-white"
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
            <div className="flex flex-row justify-between w-full">
              <span className="text-white text-xs">
                {formatTime(currentTime[0])}
              </span>
              <span className="text-white text-xs">{formatTime(duration)}</span>
            </div>
            <div className="flex items-center w-full gap-x-2 mt-1">
              {/* <input
                type="range"
                min={0}
                max={duration || 0}
                value={currentTime}
                onChange={handleSeek}
                onMouseUp={handleSeekCommit}
                onMouseDown={() => setIsSeeking(true)}
                className="w-full h-1 rounded-lg cursor-pointer appearance-none"
              /> */}
              <Slider
                min={0}
                max={duration || 0}
                value={currentTime}
                onValueChange={handleSeek}
                onValueCommit={handleSeekCommit}
                onPointerDown={() => setIsSeeking(true)}
              />
            </div>
          </div>
        </div>

        {/* Volume - Right aligned */}
        <div className="flex justify-end items-center gap-x-2">
          {volume[0] > 0 ? (
            <IoVolumeHigh
              size={24}
              onClick={() => {
                setPreviousVolume(volume);
                setVolume([0]);
              }}
              className="cursor-pointer hover:scale-105 transition"
            />
          ) : (
            <IoMdVolumeOff
              size={24}
              onClick={() => {
                setVolume(previousVolume);
              }}
              className="cursor-pointer hover:scale-105 transition"
            />
          )}
          <div className="w-[120px]">
            <Slider
              min={0}
              max={1}
              step={0.01}
              value={volume}
              onValueChange={handleVolume}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;
