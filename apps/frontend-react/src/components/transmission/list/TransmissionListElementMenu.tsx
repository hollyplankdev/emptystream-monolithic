import { DbObject, ITransmission } from "@emptystream/shared";
import { ActionIcon, Modal } from "@mantine/core";
import { IconDots } from "@tabler/icons-react";
import TransmissionDetails from "../details/TransmissionDetails";

export interface TransmissionListElementMenuProps {
  /**
   * OPTIONAL - The transmission that this menu belongs to. If not provided, the component will not
   * render.
   */
  transmission?: DbObject<ITransmission>;

  /** Is the modal controlled by this menu open? */
  isOpened: boolean;

  /** Called when the modal controlled by this menu should open. */
  openFunc: () => void;

  /** Called when the modal controlled by this menu should close. */
  closeFunc: () => void;
}

/**
 * @returns A button for a TransmissionListElement that opens a modal displaying details about the
 *   element's Transmission.
 */
export default function TransmissionListElementMenu({
  transmission,
  isOpened,
  openFunc,
  closeFunc,
}: TransmissionListElementMenuProps) {
  // TODO - Implement skeleton
  if (!transmission) return undefined;

  return (
    <>
      <ActionIcon onClick={openFunc} variant="transparent" color="white" size="md">
        <IconDots size="100%" stroke={2} />
      </ActionIcon>
      <Modal opened={isOpened} onClose={closeFunc}>
        <TransmissionDetails
          id={transmission._id}
          initialData={transmission}
          onDelete={closeFunc}
        />
      </Modal>
    </>
  );
}
