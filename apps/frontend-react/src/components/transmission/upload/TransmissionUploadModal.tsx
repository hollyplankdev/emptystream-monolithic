import { Modal } from "@mantine/core";
import TransmissionUploadForm from "./TransmissionUploadForm";

export interface TransmissionUploadModalProps {
  isOpen: boolean;
  close: () => void;
}

export default function TransmissionUploadModal({ isOpen, close }: TransmissionUploadModalProps) {
  return (
    <Modal opened={isOpen} onClose={close} title="Upload a new Transmission to `emptystream`">
      <TransmissionUploadForm onComplete={close} />
    </Modal>
  );
}
