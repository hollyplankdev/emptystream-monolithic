import { DbObject, ITransmission } from "@emptystream/shared";
import { Button, Divider, Group, Modal, Stack, Text, Title } from "@mantine/core";

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

  return (
    <Modal opened={isOpen} onClose={close} centered withCloseButton={false}>
      <Stack>
        <Title order={2}>Remove Transmission?</Title>
        <Text>This will remove the following transmission:</Text>
        <Text style={{ wordBreak: "break-word" }}>{transmission.name}</Text>
        <Text>You can not undo this!</Text>
        <Divider />
        <Group justify="flex-start">
          <Button variant="filled" flex={1} onClick={onClickCancel}>
            Nevermind...
          </Button>
          <Button variant="filled" color="red" onClick={onClickConfirm}>
            Yes, delete!
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
