import { useAuth } from "src/providers/AuthProvider";
import Button from "src/components/Button";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import AudioPlayer from "src/components/AudioPlayer";

const baseUrl = import.meta.env.VITE_API_URL;

function Home() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [url, setUrl] = useState("");

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

  useEffect(() => {
    const getAudio = async () => {
      const token = JSON.parse(
        localStorage.getItem("sb-emvtnpvqsjljsrkzmwwp-auth-token") ?? ""
      ).access_token;
      try {
        const response = await fetch(
          `${baseUrl}/music/songs?title=guitarup_looped`,
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
      <h1>Welcome, {user?.email}</h1>
      <Button onClick={handleSignOut}>Sign out</Button>
      <Button onClick={getUser}>Get Current User</Button>
      <Button onClick={() => navigate("/search")}>Search</Button>
      <Button onClick={testRabbitMQ}>Test RabbitMQ</Button>
      <div>{url && <AudioPlayer playlistUrl={url} />}</div>
      test
    </div>
  );
}

export default Home;
