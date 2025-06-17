import { useState } from "react";
import { useNavigate } from "react-router";
import Button from "src/components/Button";
import Input from "src/components/Input";
import supabase from "src/lib/supabase";

export default function AuthMFA() {
  const [verifyCode, setVerifyCode] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const onSubmitClicked = () => {
    setError("");
    (async () => {
      const factors = await supabase.auth.mfa.listFactors();
      if (factors.error) {
        throw factors.error;
      }
      const totpFactor = factors.data.totp[0];
      if (!totpFactor) {
        throw new Error("No TOTP factors found!");
      }
      const factorId = totpFactor.id;
      const challenge = await supabase.auth.mfa.challenge({ factorId });
      if (challenge.error) {
        setError(challenge.error.message);
        throw challenge.error;
      }
      const challengeId = challenge.data.id;
      const verify = await supabase.auth.mfa.verify({
        factorId,
        challengeId,
        code: verifyCode,
      });
      if (verify.error) {
        setError(verify.error.message);
        throw verify.error;
      } else {
        navigate("/", { replace: true });
      }
    })();
  };
  return (
    <>
      <div className="h-screen bg-gradient-to-t from-black from-20% to-violet-700 select-none">
        <div className="flex flex-row min-h-screen justify-center items-center">
          <div className="min-w-[300px] p-10 bg-neutral-900 w-xl rounded-xl flex flex-col items-center gap-y-6">
            <div>Please enter the code from your authenticator app.</div>
            {error && <div className="error">{error}</div>}
            <Input
              type="text"
              value={verifyCode}
              onChange={(e) => setVerifyCode(e.target.value.trim())}
            />
            <Button onClick={onSubmitClicked}>Submit</Button>
          </div>
        </div>
      </div>
    </>
  );
}
