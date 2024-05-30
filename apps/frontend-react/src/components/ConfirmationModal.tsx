import { Button, Divider, Group, Modal, Stack, Text, Title } from "@mantine/core";

export interface ConfirmationModalProps {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  cancelText?: string;
  confirmText?: string;
}

export default function ConfirmationModal({
  isOpen,
  onCancel,
  onConfirm,
  title = "Are you sure?",
  description = "You can not undo this!",
  cancelText = "Cancel",
  confirmText = "Confirm",
}: ConfirmationModalProps) {
  return (
    <Modal opened={isOpen} onClose={onCancel} centered withCloseButton={false}>
      <Stack>
        <Title order={2}>{title}</Title>
        <Text style={{ wordBreak: "break-word", whiteSpace: "pre-wrap" }}>{description}</Text>
        <Divider />
        <Group justify="flex-start">
          <Button variant="filled" flex={1} onClick={onCancel}>
            {cancelText}
          </Button>
          <Button variant="filled" color="red" onClick={onConfirm}>
            {confirmText}
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
