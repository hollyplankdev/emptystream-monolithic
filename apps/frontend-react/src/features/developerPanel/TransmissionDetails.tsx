import { DbObject, ITransmission } from "@emptystream/shared";
import {
  ActionIcon,
  Box,
  Button,
  Divider,
  Group,
  LoadingOverlay,
  Menu,
  Modal,
  SegmentedControl,
  Skeleton,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconAdjustments, IconTrash } from "@tabler/icons-react";
import { useState } from "react";
import AudioPlayer, { RHAP_UI } from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import useQueryTransmission from "../../hooks/useQueryTransmission";
import TransmissionQueries from "../../queries/TransmissionQueries";

//
//  Local Components
//

function NameField({ transmission }: { transmission?: ITransmission }) {
  if (!transmission) return <Skeleton height={45} radius="xl" />;

  return (
    <Text mih={45} size="20pt" fw={700} truncate>
      {transmission.name}
    </Text>
  );
}

function IdField({ id }: { id: string }) {
  return <Text>{id}</Text>;
}

function StemPlayer({
  transmission,
  stem,
}: {
  transmission?: DbObject<ITransmission>;
  stem: string;
}) {
  if (!transmission) return <Skeleton height={60} />;

  return (
    <AudioPlayer
      src={`transmission/${transmission._id}/${stem}`}
      showSkipControls={false}
      showJumpControls={false}
      autoPlayAfterSrcChange={false}
      layout="horizontal"
      timeFormat="mm:ss"
      customAdditionalControls={[]}
      customProgressBarSection={[RHAP_UI.CURRENT_TIME, RHAP_UI.PROGRESS_BAR]}
    />
  );
}

function StemPicker({ transmission }: { transmission?: DbObject<ITransmission> }) {
  const [pickedStem, setPickedStem] = useState("source");

  // Make a sorted array of stems, then manually place source at the
  const stems = Array.from(transmission?.stems ?? [".", "..", "...", "...."]).sort();
  stems.unshift("source");

  return (
    <Stack>
      <SegmentedControl
        disabled={!transmission}
        data={stems}
        value={pickedStem}
        onChange={setPickedStem}
      />
      <StemPlayer transmission={transmission} stem={pickedStem} />
    </Stack>
  );
}

function ConfirmDeletionModal({
  transmission,
  isOpen,
  close,
  confirmDelete,
}: {
  transmission: DbObject<ITransmission>;
  isOpen: boolean;
  close: () => void;
  confirmDelete: () => void;
}) {
  const onClickDelete = () => {
    close();
    confirmDelete();
  };

  return (
    <Modal opened={isOpen} onClose={close} centered withCloseButton={false}>
      <Stack>
        <Title order={2}>{`Remove Transmission ${transmission.name}?`}</Title>
        <Text>You can not undo this!</Text>
        <Divider />
        <Group justify="flex-start">
          <Button variant="filled" flex={1} onClick={close}>
            Nevermind...
          </Button>
          <Button variant="filled" color="red" onClick={onClickDelete}>
            Yes, delete!
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}

function SettingsMenu({
  onDelete,
  transmission,
}: {
  onDelete: () => void;
  transmission?: DbObject<ITransmission>;
}) {
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
      <ConfirmDeletionModal
        transmission={transmission}
        isOpen={isRemoveConfirmationOpen}
        close={closeRemoveConfirmation}
        confirmDelete={onDelete}
      />
    </>
  );
}

function RemovingOverlay({ isRemoving }: { isRemoving: boolean }) {
  return <LoadingOverlay visible={isRemoving} loaderProps={{ children: "Removing..." }} />;
}

//
//  Exports
//

export interface TransmissionDetailsProps {
  /** The known ID of the Transmission to display details about. */
  id: string;

  /**
   * The information that we currently know about this transmission, if there is any. The ID in this
   * object should match the ID provided above.
   */
  initialData?: DbObject<ITransmission>;

  /** Called when the user chooses to delete this Transmission. */
  onDelete?: () => void;
}

export default function TransmissionDetails({
  id,
  initialData,
  onDelete,
}: TransmissionDetailsProps) {
  const removeMutation = TransmissionQueries.useMutationRemove(id, { onSuccess: onDelete });
  const transmission = useQueryTransmission({ id, initialData });

  return (
    <Stack>
      <RemovingOverlay isRemoving={removeMutation.isPending} />
      <Stack gap={0}>
        <NameField transmission={transmission} />
        <Group justify="space-between" align="flex-end">
          <IdField id={id} />
          <SettingsMenu transmission={transmission} onDelete={removeMutation.mutate} />
        </Group>
      </Stack>
      <Divider />
      <StemPicker transmission={transmission} />
    </Stack>
  );
}
