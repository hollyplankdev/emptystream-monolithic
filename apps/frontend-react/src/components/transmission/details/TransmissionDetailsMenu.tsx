import { DbObject, ITransmission } from "@emptystream/shared";
import { ActionIcon, Menu, Skeleton } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconAdjustments, IconTrash } from "@tabler/icons-react";
import TransmissionConfirmDeleteModal from "../TransmissionConfirmDeleteModal";

export interface TransmissionDetailsMenuProps {
  onDelete: () => void;
  transmission?: DbObject<ITransmission>;
}

export default function TransmissionDetailsMenu({
  onDelete,
  transmission,
}: TransmissionDetailsMenuProps) {
  const [
    isRemoveConfirmationOpen,
    { open: openRemoveConfirmation, close: closeRemoveConfirmation },
  ] = useDisclosure(false);

  /**
   * The width & height of the settings button. We use a variable for this to make sure that the
   * skeleton's size is the same.
   */
  const buttonSize = 34;

  // If we don't have a transmission, just display a skeleton
  if (!transmission) return <Skeleton height={buttonSize} width={buttonSize} />;

  /** The assembled menu + button. */
  return (
    <>
      <Menu position="bottom-start" shadow="md">
        {/* The button that activates the visibility of this menu */}
        <Menu.Target>
          <ActionIcon size={buttonSize} variant="default">
            <IconAdjustments />
          </ActionIcon>
        </Menu.Target>

        {/* The contents of the menu dropdown */}
        <Menu.Dropdown>
          <Menu.Item
            color="red"
            leftSection={<IconTrash size={20} />}
            onClick={openRemoveConfirmation}
          >
            Delete Transmission
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
      <TransmissionConfirmDeleteModal
        transmission={transmission}
        isOpen={isRemoveConfirmationOpen}
        close={closeRemoveConfirmation}
        confirmDelete={onDelete}
      />
    </>
  );
}
