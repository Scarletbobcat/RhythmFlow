import { useEffect, useState } from "react";
import supabase from "src/lib/supabase";
import Button from "src/components/Button";
import Input from "src/components/Input";

/**
 * EnrollMFA shows a simple enrollment dialog. When shown on screen it calls
 * the `enroll` API. Each time a user clicks the Enable button it calls the
 * `challenge` and `verify` APIs to check if the code provided by the user is
 * valid.
 * When enrollment is successful, it calls `onEnrolled`. When the user clicks
 * Cancel the `onCancelled` callback is called.
 */
export function EnrollMFA({
  onEnrolled,
  onCancelled,
}: {
  onEnrolled: () => void;
  onCancelled: () => void;
}) {
  const [factorId, setFactorId] = useState("");
  const [qr, setQR] = useState(null);
  const [verifyCode, setVerifyCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [maxFactorsReached, setMaxFactorsReached] = useState(false);
  const [existingFactors, setExistingFactors] = useState<any[]>([]);
  const [hasPendingFactors, setHasPendingFactors] = useState(false);

  const onEnableClicked = () => {
    setError("");
    (async () => {
      try {
        const challenge = await supabase.auth.mfa.challenge({ factorId });
        if (challenge.error) {
          setError(challenge.error.message);
          return;
        }

        const challengeId = challenge.data.id;

        const verify = await supabase.auth.mfa.verify({
          factorId,
          challengeId,
          code: verifyCode,
        });
        if (verify.error) {
          setError(verify.error.message);
          return;
        }

        onEnrolled();
      } catch (err) {
        setError("Verification failed. Please try again.");
        console.error(err);
      }
    })();
  };

  const handleRemoveFactor = async (factorId: string) => {
    setLoading(true);
    setError("");
    try {
      const { error } = await supabase.auth.mfa.unenroll({ factorId });
      if (error) {
        setError(`Failed to remove authenticator: ${error.message}`);
        setLoading(false);
        return;
      }

      // Reset the state to try enrolling again
      setMaxFactorsReached(false);
      setHasPendingFactors(false);
      // Restart the enrollment process
      initializeEnrollment();
    } catch (err) {
      console.error("Failed to remove authenticator:", err);
      setError("Could not remove authenticator. Please try again.");
      setLoading(false);
    }
  };

  const cleanupPendingFactors = async () => {
    // Get all factors
    const { data: factors } = await supabase.auth.mfa.listFactors();

    // Find all unverified (pending) factors
    const pendingFactors = factors.totp.filter((factor) => !factor.verified);

    // If there are multiple pending factors, clean them up
    if (pendingFactors.length > 1) {
      console.log("Cleaning up excess pending factors...");

      // Keep the most recent one, remove the rest
      const [mostRecent, ...oldPendingFactors] = pendingFactors.sort((a, b) => {
        // Sort by created_at if available, otherwise by id
        const aTime = a.created_at ? new Date(a.created_at).getTime() : 0;
        const bTime = b.created_at ? new Date(b.created_at).getTime() : 0;
        return bTime - aTime; // Most recent first
      });

      // Remove older pending factors
      for (const factor of oldPendingFactors) {
        await supabase.auth.mfa.unenroll({ factorId: factor.id });
        console.log(`Removed old pending factor: ${factor.id}`);
      }
    }
  };

  const initializeEnrollment = async () => {
    setLoading(true);
    setError("");

    try {
      await cleanupPendingFactors();

      // Get fresh list of factors after cleanup
      const { data: factors } = await supabase.auth.mfa.listFactors();

      // Store existing factors for display if needed
      setExistingFactors(factors.totp);

      // If there's already a verified factor, we can skip enrollment
      const verifiedFactor = factors.totp.find((factor) => factor.verified);
      if (verifiedFactor) {
        onEnrolled(); // Skip to completion if already verified
        return;
      }

      // Check if we've hit the maximum factor limit
      // This typically happens when there are pending factors that count against the limit
      if (factors.totp.length >= 3) {
        // Assuming Supabase's default limit is 3
        setMaxFactorsReached(true);
        setLoading(false);
        return;
      }

      // If there's a pending factor, we can use it
      const pendingFactor = factors.totp.find((factor) => !factor.verified);
      if (pendingFactor) {
        setFactorId(pendingFactor.id);
        setHasPendingFactors(true);

        // We need to get the QR code again
        const { data } =
          await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
        if (data.currentLevel === "aal2") {
          onEnrolled(); // Already at AAL2, no need to enroll
          return;
        }

        // Get a fresh challenge for the existing factor
        const challenge = await supabase.auth.mfa.challenge({
          factorId: pendingFactor.id,
        });
        if (challenge.error) throw challenge.error;

        setQR(pendingFactor.totp.qr_code);
        setLoading(false);
        return;
      }

      // Otherwise create a new factor
      const friendlyName = `RhythmFlow MFA ${Date.now()}`; // Add timestamp to ensure uniqueness

      const { data, error } = await supabase.auth.mfa.enroll({
        factorType: "totp",
        friendlyName: friendlyName,
      });

      if (error) {
        // Handle maximum factor limit reached
        if (
          error.message.includes(
            "Maximum number of verified factors reached"
          ) ||
          error.message.includes("maximum number of factors") ||
          error.message.includes("unenroll to continue")
        ) {
          setMaxFactorsReached(true);
          setLoading(false);
          return;
        }

        // Better error handling for duplicate friendly name
        if (error.message.includes("already exists")) {
          console.warn(
            "Friendly name conflict detected, retrying with timestamp"
          );
          // The component will re-render and try again with a new timestamp
          setError("Setting up MFA, please wait...");
          return;
        } else {
          setError(error.message);
        }
        throw error;
      }

      setFactorId(data.id);
      setQR(data.totp.qr_code);
      setLoading(false);
    } catch (err) {
      console.error("MFA enrollment error:", err);
      setError("Could not set up MFA. Please try again later.");
      setLoading(false);
    }
  };

  useEffect(() => {
    initializeEnrollment();
  }, []);

  if (loading) {
    return <div className="flex justify-center my-4">Loading MFA setup...</div>;
  }

  if (maxFactorsReached) {
    return (
      <div className="flex flex-col items-center w-full mx-auto">
        <div className="p-4 mb-4 bg-yellow-900/30 border border-yellow-800 text-yellow-200 rounded">
          <h3 className="font-semibold mb-2">Maximum MFA devices reached</h3>
          <p>
            {existingFactors.some((f) => f.verified)
              ? "You've reached the maximum number of MFA devices for your account."
              : "You have incomplete MFA setups that need to be removed."}
          </p>
          <p className="mt-2">
            To{" "}
            {existingFactors.some((f) => f.verified)
              ? "add a new device"
              : "continue"}
            , you need to remove one of your existing authenticators:
          </p>
        </div>

        <div className="w-full mb-6">
          {existingFactors.map((factor) => (
            <div
              key={factor.id}
              className="flex items-center justify-between p-3 mb-2 bg-neutral-800 rounded border border-neutral-700"
            >
              <div>
                <span className="font-medium">
                  {factor.friendly_name || "Authenticator"}
                </span>
                <span
                  className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                    factor.verified
                      ? "bg-green-800 text-green-200"
                      : "bg-yellow-800/50 text-yellow-200"
                  }`}
                >
                  {factor.verified ? "Verified" : "Incomplete"}
                </span>
              </div>
              <Button
                onClick={() => handleRemoveFactor(factor.id)}
                className="text-red-400 border-red-800 hover:bg-red-900/30"
              >
                Remove
              </Button>
            </div>
          ))}
        </div>

        <Button
          onClick={onCancelled}
          className="mt-2 bg-transparent border-neutral-700 hover:bg-neutral-800"
        >
          Cancel
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full mx-auto">
      {error && (
        <div className="w-full p-3 mb-4 bg-red-900/30 border border-red-800 text-red-200 rounded">
          {error}
        </div>
      )}

      {hasPendingFactors && (
        <div className="w-full p-3 mb-4 bg-blue-900/30 border border-blue-800 text-blue-200 rounded">
          Continuing your previous MFA setup. If you'd like to start over,
          cancel and try again.
        </div>
      )}

      <div className="mb-6">
        <div className="bg-white p-3 rounded-lg mb-4">
          {qr && (
            <img src={qr} alt="QR Code for MFA setup" className="mx-auto" />
          )}
        </div>
      </div>

      <div className="w-full mb-4">
        <label className="block text-sm font-medium text-neutral-300 mb-1">
          Enter the 6-digit code from your app
        </label>
        <Input
          type="text"
          placeholder="Enter verification code"
          value={verifyCode}
          onChange={(e) => setVerifyCode(e.target.value.trim())}
          className="w-full bg-neutral-800 border-neutral-700"
        />
      </div>

      <div className="flex gap-4 w-full">
        <Button
          onClick={onCancelled}
          className="flex-1 bg-transparent border-neutral-700 hover:bg-neutral-800"
        >
          Cancel
        </Button>
        <Button
          onClick={onEnableClicked}
          className="flex-1 bg-blue-600 hover:bg-blue-700"
          disabled={verifyCode.length !== 6}
        >
          Verify and Enable
        </Button>
      </div>
    </div>
  );
}
