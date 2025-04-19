import { useAuth } from "src/providers/AuthProvider";
import Button from "src/components/Button";
import { useNavigate } from "react-router";
import AudioPlayer from "src/components/AudioPlayer";
import { useMusic } from "src/providers/MusicProvider";
import SongCard from "src/components/SongCard";

const baseUrl = import.meta.env.VITE_API_URL;

function Home() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { playlist, currentSong, playNext, playPrevious } = useMusic();

  const handleSignOut = async () => {
    await logout();
  };

  const testRabbitMQ = async () => {
    const token = JSON.parse(
      localStorage.getItem("sb-emvtnpvqsjljsrkzmwwp-auth-token") ?? ""
    ).access_token;
    const response = await fetch(`${baseUrl}/music/songs/send-hello-message`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.text();
      console.log(data);
    }
  };

  const getUser = async () => {
    const email = user?.email;
    const token = JSON.parse(
      localStorage.getItem("sb-emvtnpvqsjljsrkzmwwp-auth-token") ?? ""
    ).access_token;
    const response = await fetch(`${baseUrl}/users/email?email=${email}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      console.log(data);
    }
  };

  return (
    <div>
      <h1>Welcome, {user?.email}</h1>
      <Button onClick={handleSignOut}>Sign out</Button>
      <Button onClick={getUser}>Get Current User</Button>
      <Button onClick={() => navigate("/search")}>Search</Button>
      <Button onClick={testRabbitMQ}>Test RabbitMQ</Button>
      {/* <div>{url && <AudioPlayer playlistUrl={url} />}</div> */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {playlist.map((song) => (
          <SongCard
            key={song.id}
            id={song.id}
            title={song.title}
            artist={song.artist}
            songUrl={song.songUrl}
            imageUrl={song.imageUrl}
          />
        ))}
      </div>

      {currentSong && (
        <AudioPlayer
          song={currentSong}
          onPrev={playPrevious}
          onNext={playNext}
        />
      )}
    </div>
  );
}

export default Home;
