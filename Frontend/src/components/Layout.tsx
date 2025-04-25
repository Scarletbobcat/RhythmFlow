import { Outlet, useNavigate } from "react-router";
import { FaSearch } from "react-icons/fa";
import { GoHomeFill, GoHome } from "react-icons/go";
import { useAuth } from "src/providers/AuthProvider";
import Button from "./Button";
import AudioPlayer from "./AudioPlayer";
import { useMusic } from "src/providers/MusicProvider";
import Input from "./Input";
import { useEffect, useState } from "react";

function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const activePath = window.location.pathname;
  const [searchTerm, setSearchTerm] = useState("");
  const { currentSong, playNext, playPrevious } = useMusic();
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = () => {
    if (searchTerm) {
      navigate(`/search?query=${searchTerm}`);
    } else {
      navigate("/search");
    }
  };

  const handleHomeClick = () => {
    navigate("/");
  };

  useEffect(() => {
    const debouncedNavigate = setTimeout(() => {
      if (searchTerm) {
        navigate(`/search?query=${searchTerm}`);
      } else {
        navigate("/search");
      }
    }, 500);
    return () => clearTimeout(debouncedNavigate);
  }, [searchTerm]);

  return (
    <div className="flex flex-col h-screen">
      {/* Navbar */}
      <div className="flex flex-row justify-between items-center px-4">
        <div>
          <h1
            className="cursor-pointer font-semibold text-2xl"
            onClick={handleHomeClick}
          >
            RhythmFlow
          </h1>
        </div>
        {/* Navigation */}
        <div className="flex flex-row gap-y-4 items-center">
          <Button
            className="flex justify-center items-center bg-neutral-900 size-12 hover:bg-neutral-800 m-0 p-0"
            // className={`flex flex-row justify-center text-xl cursor-pointer gap-x-2 p-2 rounded-full size-12 bg-neutral-800 hover:scale-105 transition`}
            onClick={handleHomeClick}
          >
            {activePath === "/" ? (
              <GoHomeFill className="cursor-pointer" size={30} />
            ) : (
              <GoHome className="cursor-pointer text-neutral-400" size={30} />
            )}
          </Button>
          <div
            className={`flex flex-row items-center text-xl gap-x-2 p-2 rounded-md relative`}
          >
            <Input
              type="text"
              placeholder="Search"
              className="border-none rounded-full pl-12"
              value={searchTerm}
              onFocus={(e) => {
                e.target.placeholder = "";
                setIsSearchFocused(true);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearchSubmit();
                }
              }}
              onBlur={(e) => {
                e.target.placeholder = "Search";
                setIsSearchFocused(false);
              }}
              onChange={handleSearchChange}
              icon={
                <FaSearch className={isSearchFocused ? "text-white" : ""} />
              }
            />
          </div>
        </div>
        {/* User */}
        <div className="flex flex-row items-center justify-end">
          <Button onClick={logout} className="w-30">
            Log Out
          </Button>
          <img
            src={user?.user_metadata.avatar_url}
            alt="Profile Picture"
            className="rounded-full size-12 bg-neutral-800 p-2 cursor-pointer hover:scale-105 transition"
          />
        </div>
      </div>
      {/* Children */}
      <div className="flex flex-row gap-2 p-2 flex-grow overflow-y-auto">
        <div className="bg-neutral-900 rounded-lg w-64 p-4">Library</div>
        <div className="flex-grow overflow-y-auto">
          <Outlet />
        </div>
      </div>
      {/* Audio Player */}
      <AudioPlayer
        song={currentSong ?? undefined}
        onPrev={playPrevious}
        onNext={playNext}
      />
    </div>
  );
}

export default Layout;
