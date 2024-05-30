import { DbObject, ITransmission } from "@emptystream/shared";
import {
  ActionIcon,
  Divider,
  Group,
  LoadingOverlay,
  Menu,
  SegmentedControl,
  Skeleton,
  Stack,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconAdjustments, IconTrash } from "@tabler/icons-react";
import { useState } from "react";
import AudioPlayer, { RHAP_UI } from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import TransmissionQueries from "../../queries/TransmissionQueries";
import DatabaseId from "./DatabaseId";
import TransmissionConfirmDeleteModal from "./TransmissionConfirmDeleteModal";
import TransmissionName from "./TransmissionName";

//
//  Local Components
//

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
      <TransmissionConfirmDeleteModal
        transmission={transmission}
        isOpen={isRemoveConfirmationOpen}
        close={closeRemoveConfirmation}
        confirmDelete={onDelete}
      />
    </>
  );
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
  const transmission = TransmissionQueries.useQuerySingle(id, { initialData }).data;

  return (
    <Stack>
      {/* The loading overlay to display while this transmission is being deleted. */}
      <LoadingOverlay
        visible={removeMutation.isPending}
        loaderProps={{ children: "Removing..." }}
      />

      {/* Information about this Transmission */}
      <Stack gap={0}>
        <TransmissionName
          transmission={transmission}
          fontSize="20pt"
          fontWeight={700}
          skeletonHeight={45}
        />
        <Group justify="space-between" align="flex-end">
          <DatabaseId id={id} />
          <SettingsMenu transmission={transmission} onDelete={removeMutation.mutate} />
        </Group>
      </Stack>
      <Divider />
      <StemPicker transmission={transmission} />
    </Stack>
  );
}
