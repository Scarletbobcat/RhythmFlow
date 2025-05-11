import { useRef, useState } from "react";
import Song from "src/types/Song";
import { FaChevronCircleLeft, FaChevronCircleRight } from "react-icons/fa";
import SongCard from "./SongCard";

interface CarouselProps {
  songs: Song[];
  title: string;
}

const Carousel = ({ songs, title }: CarouselProps) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(true);

  const scroll = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const { scrollLeft } = carouselRef.current;
      const scrollAmount = 600;

      const newScrollLeft =
        direction === "left"
          ? scrollLeft - scrollAmount
          : scrollLeft + scrollAmount;

      carouselRef.current.scrollTo({
        left: newScrollLeft,
        behavior: "smooth",
      });

      // Update button visibility after scroll
      setTimeout(() => {
        if (carouselRef.current) {
          const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
          setShowLeftButton(scrollLeft > 10);
          setShowRightButton(scrollLeft + clientWidth < scrollWidth - 10);
        }
      }, 300);
    }
  };

  const handleScroll = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setShowLeftButton(scrollLeft > 10);
      setShowRightButton(scrollLeft + clientWidth < scrollWidth - 10);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto py-6 text-white relative">
      <div className="mb-4 flex justify-between items-center">
        {/* Title */}
        <h2 className="text-2xl font-semibold select-none">{title}</h2>
        {/* Scroll Buttons */}
        <div className="flex gap-2"></div>
      </div>

      <div className="relative">
        {/* Left gradient overlay */}
        <div
          className={`absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-neutral-900 from-30% to-transparent z-10 pointer-events-none transition-opacity duration-300 ${
            showLeftButton ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Right gradient overlay */}
        <div
          className={`absolute right-0 top-0 bottom-0 w-30 bg-gradient-to-l from-neutral-900 from-30% to-transparent z-10 pointer-events-none transition-opacity duration-300 ${
            showRightButton ? "opacity-100" : "opacity-0"
          }`}
        />
        {/* Actual Carousel */}
        <div
          ref={carouselRef}
          className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
          onScroll={handleScroll}
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {songs.map((song) => (
            <SongCard key={song.id} song={song} />
          ))}
        </div>
        <button
          onClick={() => scroll("left")}
          className={`absolute left-6 transform top-1/2 -translate-y-1/2 rounded-full z-50 transition-opacity ${
            showLeftButton ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          aria-label="Scroll left"
        >
          <FaChevronCircleLeft size={30} />
        </button>
        <button
          onClick={() => scroll("right")}
          className={`absolute right-6 transform top-1/2 -translate-y-1/2 rounded-full z-50 transition-opacity ${
            showRightButton ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          aria-label="Scroll right"
        >
          <FaChevronCircleRight size={30} />
        </button>
      </div>
    </div>
  );
};

export default Carousel;
