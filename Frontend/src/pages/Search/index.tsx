import { useEffect } from "react";

function Search() {
  useEffect(() => {
    console.log("Searching for: ", window.location.pathname);
  }, []);

  return (
    <div className="bg-neutral-900 rounded-lg p-10 h-full overflow-auto">
      <p className="font-semibold text-xl">Search</p>
    </div>
  );
}

export default Search;
