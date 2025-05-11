import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import SongCard from "src/components/SongCard";
import Song from "src/types/Song";
import { getSongs } from "src/api/songs";
import { searchSongs } from "src/api/search";
import ScrollableContainer from "src/components/ScrollableContainer";

function Search() {
  const [searchParams] = useSearchParams();
  const [data, setData] = useState<Song[] | null>();

  // call API to fetch search results
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
        const data = await getSongs();
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
    <div className="bg-neutral-900 rounded-lg flex p-10 h-full">
      <ScrollableContainer>
        <p className="text-3xl font-bold select-none mb-2">Search</p>
        <div className="flex gap-4 w-full h-full">
          {data?.map((song) => {
            return <SongCard key={song.id} song={song} />;
          })}
        </div>
      </ScrollableContainer>
    </div>
  );
}

export default Search;
