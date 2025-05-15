import { getSongByTitle } from "src/api/songs";
import Button from "src/components/Button";

function TestPage() {
  return (
    <div className="h-full w-full bg-neutral-900">
      <Button onClick={async () => console.log(await getSongByTitle("test"))}>
        Testing
      </Button>
    </div>
  );
}

export default TestPage;
