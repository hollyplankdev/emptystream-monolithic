import { DbObject, ITransmission } from "@emptystream/shared";
import ConfirmationModal from "../ConfirmationModal";

export interface TransmissionConfirmDeleteModalProps {
  transmission: DbObject<ITransmission>;
  isOpen: boolean;
  close: () => void;
  confirmDelete: () => void;
}

export default function TransmissionConfirmDeleteModal({
  transmission,
  isOpen,
  close,
  confirmDelete,
}: TransmissionConfirmDeleteModalProps) {
  const onClickCancel = () => {
    close();
  };
  const onClickConfirm = () => {
    close();
    confirmDelete();
  };

  const title = "Remove Transmission?";
  const description =
    "This will remove the following transmission:" +
    `\n${transmission.name}\n\n` +
    "You can not undo this!";

  return (
    <ConfirmationModal
      isOpen={isOpen}
      onCancel={onClickCancel}
      onConfirm={onClickConfirm}
      title={title}
      description={description}
      cancelText="Nevermind..."
      confirmText="Yes, delete!"
    />
  );
}
