import { MdLibraryAdd } from "react-icons/md";
import ScrollableContainer from "./ScrollableContainer";

import { MdPlayArrow } from "react-icons/md";

const testPlaylists = [
  {
    id: 1,
    name: "Chill Vibes",
    imageUrl: "https://pub-26db48d1379b499ba8a2bdeb7c0975dc.r2.dev/guitar.webp",
  },
  {
    id: 2,
    name: "Top Hits",
    imageUrl:
      "https://pub-26db48d1379b499ba8a2bdeb7c0975dc.r2.dev/default-album.png",
  },
  {
    id: 3,
    name: "Top Hits",
    imageUrl:
      "https://pub-26db48d1379b499ba8a2bdeb7c0975dc.r2.dev/default-album.png",
  },
  {
    id: 4,
    name: "Top Hits",
    imageUrl:
      "https://pub-26db48d1379b499ba8a2bdeb7c0975dc.r2.dev/default-album.png",
  },
  {
    id: 5,
    name: "Top Hits",
    imageUrl:
      "https://pub-26db48d1379b499ba8a2bdeb7c0975dc.r2.dev/default-album.png",
  },
  {
    id: 6,
    name: "Top Hits",
    imageUrl:
      "https://pub-26db48d1379b499ba8a2bdeb7c0975dc.r2.dev/default-album.png",
  },
  {
    id: 7,
    name: "Top Hits",
    imageUrl:
      "https://pub-26db48d1379b499ba8a2bdeb7c0975dc.r2.dev/default-album.png",
  },
  {
    id: 8,
    name: "Top Hits",
    imageUrl:
      "https://pub-26db48d1379b499ba8a2bdeb7c0975dc.r2.dev/default-album.png",
  },
  {
    id: 9,
    name: "Top Hits",
    imageUrl:
      "https://pub-26db48d1379b499ba8a2bdeb7c0975dc.r2.dev/default-album.png",
  },
  {
    id: 10,
    name: "Top Hits",
    imageUrl:
      "https://pub-26db48d1379b499ba8a2bdeb7c0975dc.r2.dev/default-album.png",
  },
  {
    id: 11,
    name: "Top Hits",
    imageUrl:
      "https://pub-26db48d1379b499ba8a2bdeb7c0975dc.r2.dev/default-album.png",
  },
];

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
        {testPlaylists.map((playlist) => (
          <div
            key={playlist.id}
            className="p-2 hover:bg-neutral-800 rounded-md flex h-20 items-center gap-x-4 cursor-pointer group/playlist"
          >
            <div className="relative h-full">
              <img
                src={playlist.imageUrl}
                alt={playlist.name}
                className="h-full aspect-square object-contain rounded-md group"
              />
              <MdPlayArrow
                size={40}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover/playlist:opacity-100 transition"
              />
            </div>
            <p>{playlist.name}</p>
          </div>
        ))}
      </ScrollableContainer>
    </div>
  );
}

export default Library;
