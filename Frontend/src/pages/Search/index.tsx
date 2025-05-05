import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import SongCard from "src/components/SongCard";
import Song from "src/types/Song";

const baseUrl = import.meta.env.VITE_API_URL;

function Search() {
  const [searchParams] = useSearchParams();
  const [data, setData] = useState<Song[] | null>();

  // call API to fetch search results
  useEffect(() => {
    const query = searchParams.get("query");

    console.log("Searching for: ", query);
    const fetchSearchResults = async () => {
      const token = JSON.parse(
        localStorage.getItem("sb-emvtnpvqsjljsrkzmwwp-auth-token") ?? "{}"
      ).access_token;
      const response = await fetch(`${baseUrl}/search/query?query=${query}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const tempData = await response.json();
      if (response.ok) {
        setData(tempData.results[0].hits);
      }
    };

    const fetchAllSongs = async () => {
      const token = JSON.parse(
        localStorage.getItem("sb-emvtnpvqsjljsrkzmwwp-auth-token") ?? "{}"
      ).access_token;
      const response = await fetch(`${baseUrl}/music/songs`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const tempData = await response.json();
      if (response.ok) {
        setData(tempData);
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
