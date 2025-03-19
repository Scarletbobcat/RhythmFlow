import { useNavigate } from "react-router";
import Button from "src/components/Button";

function Search() {
  const navigate = useNavigate();

  return (
    <div>
      Search<Button onClick={() => navigate("/")}>Back to homepage</Button>
    </div>
  );
}

export default Search;
