import { DbObject, ITransmission } from "@emptystream/shared";
import { ActionIcon, Modal } from "@mantine/core";
import { IconDots } from "@tabler/icons-react";
import TransmissionDetails from "./TransmissionDetails";

export interface TransmissionListElementMenuProps {
  transmission?: DbObject<ITransmission>;
  isOpened: boolean;
  openFunc: () => void;
  closeFunc: () => void;
}

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
