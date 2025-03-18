import { IoVolumeMuteSharp } from "react-icons/io5";
import { useNavigate } from "react-router";

import Button from "src/components/Button";

function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="h-screen w-full flex flex-col justify-center items-center">
      <IoVolumeMuteSharp size={100} />
      <div className="mt-4 text-center">
        <p>Looks like this page can't be found :(</p>
        <Button onClick={() => navigate("/")}>Back to homepage</Button>
      </div>
    </div>
  );
}

export default NotFound;
