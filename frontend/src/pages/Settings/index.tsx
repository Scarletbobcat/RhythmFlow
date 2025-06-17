import { useEffect, useState } from "react";
import ScrollableContainer from "src/components/ScrollableContainer";
import { useAuth } from "src/providers/AuthProvider";
import { deleteUser } from "src/api/users";
import { toast } from "react-toastify";
import MFA from "./components/MFA";
import DeleteAccount from "./components/DeleteAccount";
import SettingOption from "./components/SettingOptions";
import EditAccount from "./components/EditAccount";
import ProfileInfo from "./components/ProfileInfo";

function Settings() {
  const { supabaseUser, logout, isMfaEnabled } = useAuth();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isMFAOpen, setIsMFAOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
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
    <ScrollableContainer className="bg-neutral-900 rounded-lg h-full flex flex-col select-none">
      <div className="p-10">
        <p className="text-5xl font-bold select-none mb-10">Settings</p>
        <ProfileInfo />
        <div className="grid grid-cols-1 gap-y-6">
          <SettingOption
            title="Edit Account"
            description="Update your account information, including your artist name and profile picture."
          >
            <EditAccount isEditing={isEditing} setIsEditing={setIsEditing} />
          </SettingOption>
          {!isMFAEnabled && (
            <SettingOption
              title="Enable MFA"
              description="Enable Multi-Factor Authentication for added security."
            >
              <MFA isMFAOpen={isMFAOpen} setIsMFAOpen={setIsMFAOpen} />
            </SettingOption>
          )}
          <SettingOption
            title="Delete Account"
            description="Permanently delete your account and all associated data. This action cannot be undone."
          >
            <DeleteAccount
              isDeleteModalOpen={isDeleteModalOpen}
              setIsDeleteModalOpen={setIsDeleteModalOpen}
              handleDeleteAccount={handleDeleteAccount}
            />
          </SettingOption>
        </div>
      </div>
    </ScrollableContainer>
  );
}

export default Settings;
