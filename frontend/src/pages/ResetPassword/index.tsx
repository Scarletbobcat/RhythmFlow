import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import Button from "src/components/Button";
import Input from "src/components/Input";
import { useAuth } from "src/providers/AuthProvider";

function ResetPassword() {
  const { updatePassword } = useAuth();
  const [loading, setLoading] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const response = await updatePassword(newPassword);
    if (!response.success) {
      toast.error("An error has occurred. Please try again later.");
    } else {
      navigate("/login");
      toast.success("Password updated successfully! Please log in.");
    }
    setLoading(false);
  };

  return (
    <div className="h-screen bg-gradient-to-t from-black from-20% to-violet-700">
      <div className="flex flex-row min-h-screen justify-center items-center">
        <div className="min-w-[300px] p-10 bg-neutral-900 w-xl rounded-xl flex flex-col items-center">
          <h1 className="text-3xl font-bold pb-6">Reset Password</h1>
          <form
            onSubmit={handleResetPassword}
            className="flex flex-col w-5/6 justify-center items-center"
          >
            <hr className="w-full border-neutral-500 mt-10 mb-10" />
            {/* Password input */}
            <div className="flex flex-col mb-6">
              <label htmlFor="password" className="mb-2 text-sm font-semibold">
                New Password
              </label>
              <Input
                placeholder="New Password"
                type="password"
                id="password"
                onChange={(e) => {
                  setNewPassword(e.target.value);
                }}
                required
                disabled={loading}
              />
            </div>
            {/* Submit button */}
            <Button disabled={loading} type="submit">
              Reset Password
            </Button>
            <div>
              <p className="text-sm mt-4 text-neutral-400">
                <button
                  type="button"
                  onClick={() => {
                    navigate("/login");
                  }}
                  className="text-white hover:text-violet-400 cursor-pointer underline"
                >
                  Back to login
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
