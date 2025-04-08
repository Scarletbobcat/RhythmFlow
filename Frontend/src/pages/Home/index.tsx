import { useAuth } from "src/providers/AuthProvider";
import Button from "src/components/Button";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import AudioPlayer from "src/components/AudioPlayer";

function Home() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [url, setUrl] = useState("");

  const handleSignOut = async () => {
    await logout();
  };

  const getUser = async () => {
    const email = user?.email;
    const token = JSON.parse(
      localStorage.getItem("sb-emvtnpvqsjljsrkzmwwp-auth-token") || ""
    ).access_token;
    // const token = "";
    const response = await fetch(
      `http://localhost:8080/users/email?email=${email}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      console.log(data);
    }
  };

  useEffect(() => {
    const getAudio = async () => {
      const token = JSON.parse(
        localStorage.getItem("sb-emvtnpvqsjljsrkzmwwp-auth-token") || ""
      ).access_token;
      try {
        const response = await fetch(
          "http://localhost:8080/music/songs?title=guitarup_looped",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          console.log(data);
          setUrl(data.songUrl);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getAudio();
  }, []);

  return (
    <div>
      <>
        <h1>Welcome, {user?.email}</h1>
        <Button onClick={handleSignOut}>Sign out</Button>
        <Button onClick={getUser}>Get Current User</Button>
        <Button onClick={() => navigate("/search")}>Search</Button>
        <div>
          {url && (
            <AudioPlayer
              playlistUrl={
                url
                // "https://pub-26db48d1379b499ba8a2bdeb7c0975dc.r2.dev/output/mp4/160k/playlist_mp4.m3u8"
                // public url to test
                // "http://sample.vodobox.net/skate_phantom_flex_4k/skate_phantom_flex_4k.m3u8"
              }
            />
          )}
        </div>
      </>
    </div>
  );
}

export default Home;
