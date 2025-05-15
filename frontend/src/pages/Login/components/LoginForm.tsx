import Button from "src/components/Button";
import Input from "src/components/Input";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router";
import { useAuth } from "src/providers/AuthProvider";
import { useState } from "react";
import { toast } from "react-toastify";

interface LoginFormProps {
  readonly setPage: (isLogin: boolean | null) => void;
}

const GENERIC_ERROR_MESSAGE = "An error has occurred. Please try again later.";

function LoginForm({ setPage }: LoginFormProps) {
  const { loginWithEmail, loginWithGoogle } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    setLoading(true);
    const result = await loginWithGoogle();
    if (!result.success) {
      toast.error(GENERIC_ERROR_MESSAGE);
      setLoading(false);
    } else {
      setLoading(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const result = await loginWithEmail(email, password);
    if (!result.success) {
      toast.error(result.error?.message || GENERIC_ERROR_MESSAGE);
    } else {
      navigate("/");
    }
    setLoading(false);
  };

  return (
    <>
      {/* Header */}
      <h1 className="text-3xl font-bold pb-6">Log in to RhythmFlow</h1>
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
            required
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
            required
            disabled={loading}
          />
          <div className="w-full flex justify-end">
            <button
              className="text-sm text-right text-white hover:text-violet-400 cursor-pointer underline"
              onClick={(e) => {
                e.preventDefault();
                setPage(null);
              }}
              type="button"
            >
              Forgot Password
            </button>
          </div>
        </div>
        {/* Submit button */}
        <Button disabled={loading} type="submit">
          Log in
        </Button>
        {/* Register link */}
        <div>
          <p className="text-sm mt-4 text-neutral-400">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={() => setPage(false)}
              className="text-white hover:text-violet-400 cursor-pointer underline"
            >
              Sign up for RhythmFlow
            </button>
          </p>
        </div>
      </form>
    </>
  );
}

export default LoginForm;
