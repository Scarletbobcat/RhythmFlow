import { MdLibraryAdd } from "react-icons/md";
import { IoLibrary } from "react-icons/io5";

import ScrollableContainer from "./ScrollableContainer";
import { getSongByUser } from "src/api/songs";
import { useEffect, useState } from "react";
import Song from "src/types/Song";
import { useMusic } from "src/providers/MusicProvider";
import UsersSong from "./SidebarSong";

function Library() {
  const [usersSongs, setUsersSongs] = useState<Song[] | null>(null);
  const {
    setPlaylist,
    setCurrentSong,
    currentSong,
    isPlaying,
    togglePlayPause,
  } = useMusic();

  useEffect(() => {
    const fetchUsersSongs = async () => {
      try {
        const data = await getSongByUser();
        console.log("Users Songs: ", data);
        if (data) {
          setUsersSongs(data);
        }
      } catch (error) {
        console.error("Error fetching user's songs:", error);
      }
    };

    fetchUsersSongs();
  }, []);

  return (
    <div className="bg-neutral-900 rounded-lg w-64 min-w-64 p-2 flex flex-col h-full select-none">
      {/* Header - fixed at top */}
      <div className="flex justify-between items-center p-2 mb-2">
        <div className="flex items-center gap-x-2">
          <p className="font-semibold text-2xl">Library</p>
          <IoLibrary size={24} />
        </div>
        <MdLibraryAdd
          size={24}
          className="text-neutral-400 hover:text-white cursor-pointer"
        />
      </div>

      {/* Content - scrollable */}
      <ScrollableContainer>
        {usersSongs &&
          usersSongs.map((song) => (
            <UsersSong
              song={song}
              setPlaylist={() => setPlaylist(usersSongs)}
              currentSong={currentSong}
              setCurrentSong={setCurrentSong}
              isPlaying={isPlaying}
              togglePlayPause={togglePlayPause}
              key={song.id}
            />
          ))}
      </ScrollableContainer>
    </div>
  );
}

export default Library;
