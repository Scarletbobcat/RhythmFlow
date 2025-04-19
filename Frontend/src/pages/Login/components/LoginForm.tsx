import Button from "src/components/Button";
import Input from "src/components/Input";
import { LuCircleAlert } from "react-icons/lu";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router";
import { useAuth } from "src/providers/AuthProvider";
import { useState } from "react";

function LoginForm() {
  const { loginWithEmail, loginWithGoogle } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    setLoading(true);
    const result = await loginWithGoogle();
    if (!result.success) {
      const message = result.error?.message
        ? result.error.message[0].toUpperCase() + result.error.message.slice(1)
        : "An error occurred";
      setError(message);
    } else {
      navigate("/");
    }
    setLoading(false);
  };

  const handleEmailLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const result = await loginWithEmail(email, password);
    if (!result.success) {
      const message = result.error?.message
        ? result.error.message[0].toUpperCase() + result.error.message.slice(1)
        : "An error occurred";
      setError(message);
    } else {
      navigate("/");
    }
    setLoading(false);
  };

  return (
    <>
      {/* Header */}
      <h1 className="text-3xl font-bold pb-6">Log in to RhythmFlow</h1>
      {/* Error message */}
      {error && (
        <div className="bg-red-500 w-full p-3 m-4 flex items-center rounded-sm">
          <LuCircleAlert className="text-3xl pr-2" />
          <p>{error}</p>
        </div>
      )}
      <form
        onSubmit={handleEmailLogin}
        className="flex flex-col w-5/6 justify-center items-center"
      >
        {/* Providers */}
        <Button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="bg-neutral-900 hover:bg-neutral-800 border border-neutral-500 flex items-center justify-center"
        >
          <FcGoogle className="text-2xl ml-4" />
          <p className="font-bold w-full justify-center">
            Continue with Google
          </p>
        </Button>
        <hr className="w-full border-neutral-500 mt-10 mb-10" />
        {/* Email input */}
        <div className="flex flex-col mb-6">
          <label htmlFor="email" className="mb-2 text-sm font-semibold">
            Email
          </label>
          <Input
            autoComplete="email"
            placeholder="Email"
            type="email"
            id="email"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            disabled={loading}
          />
        </div>
        {/* Password input */}
        <div className="flex flex-col mb-6">
          <label htmlFor="password" className="mb-2 text-sm font-semibold">
            Password
          </label>
          <Input
            placeholder="Password"
            type="password"
            id="password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            disabled={loading}
          />
        </div>
        {/* Submit button */}
        <Button disabled={loading} type="submit">
          Log in
        </Button>
      </form>
    </>
  );
}

export default LoginForm;
