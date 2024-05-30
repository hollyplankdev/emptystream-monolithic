import { Button, Divider, Group, Modal, Stack, Text, Title } from "@mantine/core";

export interface ConfirmationModalProps {
  /** Is the modal open and displaying on screen right now? */
  isOpen: boolean;

  /**
   * The title to display at the top of this modal.
   *
   * @default "Are you sure?"
   */
  title?: string;

  /**
   * The description to display under the title of this modal.
   *
   * @default "You can not undo this!"
   */
  description?: string;

  /**
   * The text to put inside the cancel button.
   *
   * @default "Cancel"
   */
  cancelText?: string;

  /**
   * The text to put inside the confirm button.
   *
   * @default "Confirm"
   */
  confirmText?: string;

  /** A callback that is called when the user clicks the confirm button in this modal. */
  onConfirm: () => void;

  /** A callback that is called when the user clicks the cancel button or closes this modal. */
  onCancel: () => void;
}

/** @returns A modal that asks the user for confirmation. */
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
