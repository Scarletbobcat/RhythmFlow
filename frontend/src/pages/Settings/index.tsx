import { useEffect, useState } from "react";
import Button from "src/components/Button";
import Modal from "src/components/Modal";
import ScrollableContainer from "src/components/ScrollableContainer";
import { useAuth } from "src/providers/AuthProvider";
import { deleteUser } from "src/api/users";
import { toast } from "react-toastify";
import { EnrollMFA } from "src/components/EnrollMFA";

const DELETE_MODAL_DESCRIPTION =
  "Are you sure you want to delete your account? This action will permanently delete your account and all associated data, including your uploaded songs, playlists, and preferences. This action cannot be undone.";

function Settings() {
  const { supabaseUser, user, logout, isMfaEnabled } = useAuth();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isMFAOpen, setIsMFAOpen] = useState(false);
  const [isMFAEnabled, setIsMfaEnabled] = useState(false);

  useEffect(() => {
    const checkMFA = async () => {
      setIsMfaEnabled(await isMfaEnabled());
    };
    if (supabaseUser) {
      checkMFA();
    }
  });

  const handleDeleteAccount = async () => {
    try {
      await deleteUser(supabaseUser?.id || "");
      await logout();
    } catch {
      toast.error("Failed to delete user. Please contact support.");
    }
    setIsDeleteModalOpen(false);
  };

  return (
    <ScrollableContainer className="bg-gradient-to-t from-60% from-neutral-900 to-violet-700 rounded-lg h-full flex flex-col select-none">
      <div className="p-10">
        <div className="flex items-center gap-4 pb-6">
          <img
            src={
              supabaseUser?.user_metadata?.avatar_url ??
              user?.profilePictureUrl ??
              "https://pub-26db48d1379b499ba8a2bdeb7c0975dc.r2.dev/user.png"
            }
            alt="Profile"
            className="rounded-full size-36 bg-neutral-800 p-2 cursor-pointer hover:scale-105 transition mb-4"
          />
          <p className="text-7xl font-bold">{user?.artistName}</p>
        </div>
        <p className="text-3xl font-bold select-none mb-2">Settings</p>
        <Button onClick={() => setIsDeleteModalOpen(true)}>
          Delete Account
        </Button>
        {!isMFAEnabled && (
          <>
            <Button onClick={() => setIsMFAOpen(true)}>Enable MFA</Button>
            <Modal
              isOpen={isMFAOpen}
              onClose={() => setIsMFAOpen(false)}
              title="Enable Multi-Factor Authentication"
              description="To enhance the security of your account, you can enable Multi-Factor Authentication (MFA). This will require an additional verification step when logging in."
            >
              <EnrollMFA
                onEnrolled={() => {
                  setIsMFAOpen(false);
                  toast.success("MFA enabled successfully!");
                }}
                onCancelled={() => setIsMFAOpen(false)}
              />
            </Modal>
          </>
        )}
        <Modal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          title="Delete Account"
          description={DELETE_MODAL_DESCRIPTION}
        >
          <form className="flex justify-between gap-10">
            <Button
              className="bg-neutral-500 hover:bg-neutral-400"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="bg-red-500 hover:bg-red-400"
              onClick={handleDeleteAccount}
            >
              Delete
            </Button>
          </form>
        </Modal>
      </div>
    </ScrollableContainer>
  );
}

export default Settings;
