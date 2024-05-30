import { Modal } from "@mantine/core";
import TransmissionUploadForm from "./TransmissionUploadForm";

export interface TransmissionUploadModalProps {
  /** Is this modal currently open? */
  isOpen: boolean;

  /** Called when the modal should be closed. */
  close: () => void;
}

/** @returns A modal allowing the user to upload a new Transmission. */
export default function TransmissionUploadModal({ isOpen, close }: TransmissionUploadModalProps) {
  return (
    <Modal opened={isOpen} onClose={close} title="Upload a new Transmission to `emptystream`">
      <TransmissionUploadForm onComplete={close} />
    </Modal>
  );
}
