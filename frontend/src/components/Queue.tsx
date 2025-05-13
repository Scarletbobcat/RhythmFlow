import { useMusic } from "src/providers/MusicProvider";
import ScrollableContainer from "./ScrollableContainer";
import SidebarSong from "./SidebarSong";
import { MdOutlineQueueMusic } from "react-icons/md";

function Queue() {
  const { playlist, currentSong, setCurrentSong, isPlaying, togglePlayPause } =
    useMusic();
  const currentIndex = playlist.findIndex(
    (song) => song.id === currentSong?.id
  );

  return (
    <div className="bg-neutral-900 rounded-lg w-64 min-w-64 p-2 flex flex-col h-full select-none">
      {/* Header */}
      <div className="flex justify-between items-center p-2 mb-2">
        <div className="flex items-center gap-x-2">
          <p className="font-semibold text-2xl">Queue</p>
          <MdOutlineQueueMusic size={24} />
        </div>
      </div>

      {/* Queue Content */}
      <ScrollableContainer>
        <div className="p-2 flex flex-col gap-y-2">
          {/* Now Playing */}
          <div>
            <p className="pb-2 font-semibold">Now Playing</p>
            {currentSong && (
              <SidebarSong
                song={currentSong}
                currentSong={currentSong}
                setCurrentSong={setCurrentSong}
                isPlaying={isPlaying}
                togglePlayPause={togglePlayPause}
              />
            )}
          </div>
          <div>
            {/* Up Next */}
            <p className="pb-2">Up Next</p>
            {playlist &&
              playlist.map((song, index) => {
                if (index > currentIndex) {
                  return (
                    <SidebarSong
                      song={song}
                      currentSong={currentSong}
                      setCurrentSong={setCurrentSong}
                      isPlaying={isPlaying}
                      togglePlayPause={togglePlayPause}
                      key={song.id}
                    />
                  );
                }
              })}
          </div>
        </div>
      </ScrollableContainer>
    </div>
  );
}

export default Queue;
