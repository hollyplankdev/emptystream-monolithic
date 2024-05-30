import { DbObject, ITransmission } from "@emptystream/shared";
import ConfirmationModal from "../ConfirmationModal";

export interface TransmissionConfirmDeleteModalProps {
  /** The transmission to confirm that we want to delete. */
  transmission: DbObject<ITransmission>;

  /** Is this modal open? */
  isOpen: boolean;

  /** A function called when this modal should be closed. Called both on confirm or cancel. */
  close: () => void;

  /** A function called when the user confirms that they want to delete the transmission. */
  confirmDelete: () => void;
}

/** @returns A modal asking the user to confirm if they really want to delete a Transmission. */
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
