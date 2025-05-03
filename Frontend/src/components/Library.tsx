import { MdLibraryAdd } from "react-icons/md";
import ScrollableContainer from "./ScrollableContainer";

function Library() {
  return (
    <div className="bg-neutral-900 rounded-lg w-64 p-2 flex flex-col h-full select-none">
      {/* Header - fixed at top */}
      <div className="flex justify-between items-center p-2 mb-2">
        <p className="font-semibold text-xl">Library</p>
        <MdLibraryAdd
          size={24}
          className="text-neutral-400 hover:text-white cursor-pointer"
        />
      </div>

      {/* Content - scrollable */}
      <ScrollableContainer>
        {Array(20)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="p-2 my-2 hover:bg-neutral-800 rounded-md">
              Playlist {i + 1}
            </div>
          ))}
      </ScrollableContainer>
    </div>
  );
}

export default Library;
