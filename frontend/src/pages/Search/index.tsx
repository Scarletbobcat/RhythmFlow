import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import SongCard from "src/components/SongCard";
import Song from "src/types/Song";
import { getSongs } from "src/api/songs";
import { searchSongs } from "src/api/search";

function Search() {
  const [searchParams] = useSearchParams();
  const [data, setData] = useState<Song[] | null>();

  // call API to fetch search results
  useEffect(() => {
    const query = searchParams.get("query");

    console.log("Searching for: ", query);
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
    <div className="bg-neutral-900 rounded-lg p-10 h-full overflow-auto">
      <p className="font-semibold text-xl">Search</p>
      <div className="flex gap-4">
        {data?.map((song) => {
          return <SongCard key={song.id} song={song} />;
        })}
      </div>
    </div>
  );
}

export default Search;
