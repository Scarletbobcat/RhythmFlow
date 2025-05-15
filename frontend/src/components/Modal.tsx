import * as Dialog from "@radix-ui/react-dialog";
import { IoMdClose } from "react-icons/io";

interface ModalProps {
  title: string;
  description: string;
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
}

function Modal({ title, description, children, isOpen, onClose }: ModalProps) {
  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-neutral-900/90 backdrop-blur-xs fixed inset-0" />
        <Dialog.Content
          className="
        fixed
        top-[50%]
        left-[50%]
        max-h-full
        h-full
        md:h-auto
        md:max-h-[85vh]
        w-full
        md:w-[90vw]
        md:max-w-[450px]
        drop-shadow-lg
        border
        border-neutral-700
        translate-x-[-50%]
        translate-y-[-50%]
        rounded-md
        bg-neutral-800
        p-6
        focus:outline-none
        outline-none"
        >
          <Dialog.Title
            className="
          text-xl
          text-center
          font-bold
          mb-4
          "
          >
            {title}
          </Dialog.Title>
          <Dialog.Description
            className="
          mb-5
          text-sm
          text-center
          leading-normal
          "
          >
            {description}
          </Dialog.Description>
          <div>{children}</div>
          <button
            className="absolute top-4 right-4 text-neutral-400 hover:text-white inline-flex appearance-none items-center justify-center rounded-full focus:outline-none cursor-pointer"
            onClick={onClose}
          >
            <IoMdClose size={24} />
          </button>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default Modal;
