import { ReactNode, useRef, useState, useEffect } from "react";

interface ScrollableContainerProps {
  readonly children: ReactNode;
  readonly className?: string;
}

function ScrollableContainer({
  children,
  className = "",
}: ScrollableContainerProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [scrollHeight, setScrollHeight] = useState(0);
  const [clientHeight, setClientHeight] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartY, setDragStartY] = useState(0);
  const [startScrollPos, setStartScrollPos] = useState(0);

  // Track scroll position and dimensions
  useEffect(() => {
    const content = contentRef.current;
    if (!content) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = content;
      setScrollPosition(scrollTop);
      setScrollHeight(scrollHeight);
      setClientHeight(clientHeight);
    };

    const handleMouseEnter = () => {
      setScrollHeight(content.scrollHeight);
      setClientHeight(content.clientHeight);
    };

    // Initialize dimensions
    handleScroll();

    // Add scroll event listener
    content.addEventListener("scroll", handleScroll);
    content.addEventListener("mouseenter", handleMouseEnter);
    return () => {
      content.removeEventListener("scroll", handleScroll);
      content.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, []);

  // Handle drag events
  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!contentRef.current || !isDragging) return;

      const { clientHeight, scrollHeight } = contentRef.current;
      const deltaY = e.clientY - dragStartY;
      const scrollRatio = scrollHeight / clientHeight;
      const newScrollTop = startScrollPos + deltaY * scrollRatio;

      contentRef.current.scrollTop = Math.max(
        0,
        Math.min(scrollHeight - clientHeight, newScrollTop)
      );
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, dragStartY, startScrollPos]);

  // Calculate thumb position and height
  const thumbHeight = Math.max(
    clientHeight > 0 ? (clientHeight / scrollHeight) * clientHeight : 0,
    30
  ); // Minimum thumb size
  const thumbPosition =
    clientHeight - thumbHeight > 0
      ? (scrollPosition / (scrollHeight - clientHeight)) *
        (clientHeight - thumbHeight)
      : 0;

  // Handle thumb mousedown
  const handleThumbMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStartY(e.clientY);
    setStartScrollPos(scrollPosition);
  };

  return (
    <div className={`flex-grow overflow-hidden group relative ${className}`}>
      {/* Custom scrollbar thumb that moves and can be dragged */}
      <div
        className={`absolute right-0 top-0 bottom-0 w-2 ${isDragging ? "opacity-100" : "opacity-0"} group-hover:opacity-100 transition-opacity duration-300 ease-in-out`}
        role="scrollbar"
        aria-controls="scrollableContent"
        aria-valuenow={Math.round(
          (scrollPosition / (scrollHeight - clientHeight || 1)) * 100
        )}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={`${isDragging ? "bg-neutral-600" : "bg-neutral-700"} absolute w-2 opacity-70 hover:bg-neutral-600 rounded-full`}
          style={{
            height: `${thumbHeight}px`,
            transform: `translateY(${thumbPosition}px)`,
            right: "0",
            top: "0",
          }}
          onMouseDown={handleThumbMouseDown}
          tabIndex={0}
          role="presentation"
          aria-label="Scroll content"
        ></div>
      </div>

      {/* Content with hidden scrollbar */}
      <div
        ref={contentRef}
        className="h-full w-full overflow-y-auto pr-2
          [&::-webkit-scrollbar]:w-0
          [&::-webkit-scrollbar]:opacity-0
          [-ms-overflow-style:none]
          [scrollbar-width:none]"
      >
        {children}
      </div>
    </div>
  );
}

export default ScrollableContainer;
