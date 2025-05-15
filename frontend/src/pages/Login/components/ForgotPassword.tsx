import { useState } from "react";
import { toast } from "react-toastify";
import Button from "src/components/Button";
import Input from "src/components/Input";
import { useAuth } from "src/providers/AuthProvider";

interface ForgotPasswordProps {
  readonly setPage: (isLogin: boolean | null) => void;
}

function ForgotPassword({ setPage }: ForgotPasswordProps) {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const result = await forgotPassword(email);
    if (!result.success) {
      toast.error("An error has occurred. Please try again later.");
    } else {
      toast.success("Password reset email sent! Please check your inbox.");
      setPage(true);
    }
    setLoading(false);
  };

  return (
    <>
      {/* Header */}
      <h1 className="text-3xl font-bold">Forgot Password</h1>
      <form
        onSubmit={handleForgotPassword}
        className="flex flex-col w-5/6 justify-center items-center"
      >
        <hr className="w-full border-neutral-500 mt-10 mb-10" />
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

        {/* Submit button */}
        <Button disabled={loading} type="submit">
          Send Password Reset Email
        </Button>
        {/* Register link */}
        <div>
          <p className="text-sm mt-4 text-neutral-400">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => {
                setPage(true);
              }}
              className="text-white hover:text-violet-400 cursor-pointer underline"
            >
              Back to Login
            </button>
          </p>
        </div>
      </form>
    </>
  );
}

export default ForgotPassword;
