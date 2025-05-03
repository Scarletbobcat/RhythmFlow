import { Outlet, useNavigate } from "react-router";
import { FaSearch } from "react-icons/fa";
import { GoHomeFill, GoHome } from "react-icons/go";
import { useAuth } from "src/providers/AuthProvider";
import Button from "./Button";
import AudioPlayer from "./AudioPlayer";
import { useMusic } from "src/providers/MusicProvider";
import Input from "./Input";
import { useEffect, useRef, useState } from "react";
import { MdLibraryMusic } from "react-icons/md";
import Library from "./Library";

function Layout() {
  const { user, logout } = useAuth();
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const activePath = window.location.pathname;
  const [searchTerm, setSearchTerm] = useState("");
  const { currentSong, playNext, playPrevious } = useMusic();
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isBrowsing, setIsBrowsing] = useState(false);

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
    setSearchTerm("");
    navigate("/");
    setIsBrowsing(false);
  };

  useEffect(() => {
    const debouncedNavigate = setTimeout(() => {
      if (searchTerm) {
        navigate(`/search?query=${searchTerm}`);
        setIsBrowsing(false);
      } else {
        if (activePath !== "/") {
          navigate("/search");
          setIsBrowsing(true);
        }
      }
    }, 500);
    return () => clearTimeout(debouncedNavigate);
  }, [searchTerm, isSearchFocused, navigate, activePath]);

  return (
    <div className="flex flex-col h-screen select-none">
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
            onClick={handleHomeClick}
          >
            {activePath === "/" ? (
              <GoHomeFill className="cursor-pointer" size={30} />
            ) : (
              <GoHome className="cursor-pointer text-neutral-400" size={30} />
            )}
          </Button>
          <div className="flex flex-row items-center text-xl gap-x-2 p-2 rounded-md relative">
            <Input
              type="text"
              placeholder="What do you want to listen to?"
              className="border-none rounded-full pl-12 text-md w-125 transition-all duration-100"
              value={searchTerm}
              onFocus={() => {
                setIsSearchFocused(true);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearchSubmit();
                }
              }}
              onBlur={() => {
                setIsSearchFocused(false);
              }}
              ref={inputRef}
              onChange={handleSearchChange}
              startIcon={
                <FaSearch
                  className={`cursor-pointer select-none ${isSearchFocused ? "text-white" : ""}`}
                  // size={28}
                  onClick={() => {
                    inputRef.current?.focus();
                  }}
                />
              }
              endIcon={
                <MdLibraryMusic
                  className={`cursor-pointer ${isBrowsing ? "text-white" : ""}`}
                  size={26}
                  onClick={() => {
                    navigate("/search");
                    setIsBrowsing(true);
                  }}
                />
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
        <Library />
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
