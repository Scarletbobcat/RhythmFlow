import { useEffect, useRef } from "react";
import Hls from "hls.js";

interface AudioPlayerProps {
  playlistUrl: string;
}

const AudioPlayer = ({ playlistUrl }: AudioPlayerProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    // Check if the browser supports HLS.js
    if (Hls.isSupported()) {
      const hls = new Hls({
        startLevel: 0,
        maxBufferLength: 10,
      });

      // Attach the HLS stream to the audio element
      hls.loadSource(playlistUrl);
      if (audioRef.current) {
        hls.attachMedia(audioRef.current);
      }

      // Event listeners for playback state changes
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        console.log("Manifest loaded successfully");
      });

      hls.on(Hls.Events.ERROR, (_event, data) => {
        console.error("Error occurred in HLS.js:", data);
      });

      hls.on(Hls.Events.FRAG_LOADING, (_, data) => {
        console.log(
          `[HLS] Fetching segment ${data.frag.sn} from level ${data.frag.level}`
        );
      });

      // Cleanup HLS when the component is unmounted
      return () => {
        hls.destroy();
      };
    } else if (
      audioRef?.current?.canPlayType("application/vnd.apple.mpegurl")
    ) {
      // Fallback for Safari or other browsers that support native HLS
      audioRef.current.src = playlistUrl;
    } else {
      console.error("Your browser does not support HLS.");
    }
  }, [playlistUrl]);

  return (
    <div>
      <audio ref={audioRef} controls>
        <p>Your browser does not support the audio element.</p>
      </audio>
    </div>
  );
};

export default AudioPlayer;
