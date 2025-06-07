import { useEffect, useState } from "react";
import Button from "src/components/Button";
import Input from "src/components/Input";
import Modal from "src/components/Modal";
import { useAuth } from "src/providers/AuthProvider";
import { RhythmFlowUser } from "src/types/RhythmFlowUser";
import { updateUser } from "src/api/users";

interface EditAccountProps {
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
}

const EDIT_MODAL_DESCRIPTION = "You can edit your account information here.";

function EditAccount({ isEditing, setIsEditing }: EditAccountProps) {
  const { user, fetchRhythmFlowUser, fetchUserSongs } = useAuth();
  const [updatedUser, setUpdatedUser] = useState<RhythmFlowUser | null>(user);
  const [profilePictureFile, setProfilePictureFile] = useState<
    File | undefined
  >(undefined);

  useEffect(() => {
    if (user?.artistName) {
      setUpdatedUser({ ...user, artistName: user.artistName });
    }
    if (user?.profilePictureUrl) {
      setUpdatedUser({ ...user, profilePictureUrl: user.profilePictureUrl });
    }
  }, [user, isEditing]);

  if (!user || !updatedUser) {
    return null;
  }

  const handleEditAccount = async () => {
    // Logic to handle account editing goes here
    await updateUser(updatedUser, profilePictureFile);
    await fetchRhythmFlowUser();
    await fetchUserSongs();
    setIsEditing(false);
  };

  return (
    <>
      <Button onClick={() => setIsEditing(true)}>Edit Account</Button>
      <Modal
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        title="Edit Account"
        description={EDIT_MODAL_DESCRIPTION}
      >
        <form className="flex flex-col justify-center items-center gap-y-6">
          <div className="flex flex-col gap-y-2">
            <label htmlFor="artistName" className="text-md font-semibold">
              Artist Name
            </label>
            <Input
              type="text"
              id="artistName"
              placeholder="Enter your artist name"
              value={updatedUser?.artistName || ""}
              onChange={(e) =>
                setUpdatedUser({ ...updatedUser, artistName: e.target.value })
              }
            />
          </div>
          <div className="flex flex-col gap-y-2">
            <label htmlFor="profilePicture" className="text-md font-semibold">
              Profile Picture
            </label>
            <div className="flex items-center gap-x-4">
              <Input
                type="file"
                accept="image/*"
                id="profilePicture"
                className="max-w-3xs"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setProfilePictureFile(e.target.files[0]);
                    // creates preview of the image to display
                    setUpdatedUser({
                      ...updatedUser,
                      profilePictureUrl: URL.createObjectURL(e.target.files[0]),
                    });
                  }
                }}
              />
              {/* profile picture preview */}
              {updatedUser.profilePictureUrl && (
                <div className="flex-shrink-0">
                  <img
                    src={updatedUser.profilePictureUrl}
                    alt="Profile preview"
                    className="size-12 object-cover rounded-full"
                  />
                </div>
              )}
            </div>
          </div>
          <div className="grid grid-cols-2">
            <Button
              className="bg-neutral-500 hover:bg-neutral-400 w-40"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleEditAccount} className="w-40">
              Save
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}

export default EditAccount;
