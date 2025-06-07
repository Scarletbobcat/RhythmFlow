import { toast } from "react-toastify";
import Button from "src/components/Button";
import { EnrollMFA } from "src/components/EnrollMFA";
import Modal from "src/components/Modal";

interface MFAProps {
  isMFAOpen: boolean;
  setIsMFAOpen: (isOpen: boolean) => void;
}

function MFA({ isMFAOpen, setIsMFAOpen }: MFAProps) {
  return (
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
  );
}

export default MFA;
