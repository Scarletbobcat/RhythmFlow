import Button from "src/components/Button";
import Modal from "src/components/Modal";

interface DeleteAccountProps {
  isDeleteModalOpen: boolean;
  setIsDeleteModalOpen: (isOpen: boolean) => void;
  handleDeleteAccount: () => Promise<void>;
}

const DELETE_MODAL_DESCRIPTION =
  "Are you sure you want to delete your account? This action will permanently delete your account and all associated data, including your uploaded songs, playlists, and preferences. This action cannot be undone.";

function DeleteAccount({
  isDeleteModalOpen,
  setIsDeleteModalOpen,
  handleDeleteAccount,
}: DeleteAccountProps) {
  return (
    <>
      <Button onClick={() => setIsDeleteModalOpen(true)}>Delete Account</Button>
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
    </>
  );
}

export default DeleteAccount;
