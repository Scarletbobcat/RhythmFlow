import { useAuth } from "src/providers/AuthProvider";
import Button from "src/components/Button";

function Home() {
  const { user, logout } = useAuth();

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

  return (
    <div>
      <>
        <h1>Welcome, {user?.email}</h1>
        <Button onClick={handleSignOut}>Sign out</Button>
        <Button onClick={getUser}>Get Current User</Button>
      </>
    </div>
  );
}

export default Home;
