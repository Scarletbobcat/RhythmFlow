import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import SongCard from "src/components/SongCard";
import Song from "src/types/Song";
import { getAllSongs, searchSongs } from "src/api/search";
import ScrollableContainer from "src/components/ScrollableContainer";

function Search() {
  const [searchParams] = useSearchParams();
  const [data, setData] = useState<Song[] | null>();

  useEffect(() => {
    const query = searchParams.get("query");

    const fetchSearchResults = async () => {
      try {
        const data = await searchSongs(query ?? "");
        setData(data.results[0].hits);
      } catch (error) {
        console.error("Failed to fetch search results", error);
      }
    };

    const fetchAllSongs = async () => {
      try {
        const data = await getAllSongs();
        setData(data);
      } catch (error) {
        console.error("Failed to fetch all songs", error);
      }
    };

    if (query) {
      fetchSearchResults();
    } else {
      fetchAllSongs();
    }
  }, [searchParams]);

  return (
    <ScrollableContainer className="bg-neutral-900 rounded-lg flex flex-col h-full">
      <div className="p-10">
        <p className="text-5xl font-bold select-none mb-10">Search</p>
        <div className="flex flex-wrap gap-4 w-full">
          {data?.map((song) => {
            return <SongCard key={song.id} song={song} />;
          })}
        </div>
      </div>
    </ScrollableContainer>
  );
}

export default Search;
