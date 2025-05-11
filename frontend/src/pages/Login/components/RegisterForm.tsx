import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { toast } from "react-toastify";

import Button from "src/components/Button";
import Input from "src/components/Input";
import { useAuth } from "src/providers/AuthProvider";

interface RegisterFormProps {
  readonly setIsLogin: (isLogin: boolean) => void;
}

const GENERIC_ERROR_MESSAGE = "An error has occurred. Please try again later.";

function RegisterForm({ setIsLogin }: RegisterFormProps) {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [artistName, setArtistName] = useState("");
  const { signUpWithEmail, loginWithGoogle } = useAuth();

  const handleGoogleSignUp = async () => {
    setLoading(true);
    const result = await loginWithGoogle();
    if (!result.success) {
      const message = result.error?.message
        ? result.error.message[0].toUpperCase() + result.error.message.slice(1)
        : GENERIC_ERROR_MESSAGE;
      toast.error(message);
    }
    setLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const result = await signUpWithEmail(email, artistName, password);
    if (!result.success) {
      toast.error(result.error?.message ?? GENERIC_ERROR_MESSAGE);
    }
    setLoading(false);
    if (result.success) {
      toast.success(
        "Registration successful! Please check your email to verify your account."
      );
      setIsLogin(true);
    }
  };

  return (
    <>
      {/* Header */}
      <h1 className="text-3xl font-bold pb-6">Register with RhythmFlow</h1>
      <form
        onSubmit={handleSignUp}
        className="flex flex-col w-5/6 justify-center items-center"
      >
        {/* Providers */}
        <Button
          onClick={handleGoogleSignUp}
          disabled={loading}
          className="bg-neutral-900 hover:bg-neutral-800 border border-neutral-500 flex items-center justify-center"
        >
          <FcGoogle className="text-2xl ml-4" />
          <p className="font-bold w-full justify-center">Sign up with Google</p>
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
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            required
          />
        </div>
        {/* Artist Name input */}
        <div className="flex flex-col mb-6">
          <label htmlFor="artistName" className="mb-2 text-sm font-semibold">
            Artist Name
          </label>
          <Input
            autoComplete="artist-alias"
            placeholder="Artist Name"
            type="text"
            id="artistName"
            onChange={(e) => setArtistName(e.target.value)}
            disabled={loading}
            required
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
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            required
          />
        </div>
        {/* Submit button */}
        <Button disabled={loading} type="submit">
          Register
        </Button>
        {/* Log in link */}
        <div>
          <p className="text-sm mt-4 text-neutral-400">
            Don't have an account?{" "}
            <button
              onClick={() => setIsLogin(true)}
              className="text-white hover:text-violet-400 cursor-pointer underline"
            >
              Log in to RhythmFlow
            </button>
          </p>
        </div>
      </form>
    </>
  );
}

export default RegisterForm;
