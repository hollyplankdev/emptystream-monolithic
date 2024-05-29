import { DbObject, ITransmission } from "@emptystream/shared";
import {
  ActionIcon,
  Divider,
  Group,
  Menu,
  SegmentedControl,
  Skeleton,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { IconAdjustments, IconTrash } from "@tabler/icons-react";
import { useState } from "react";
import AudioPlayer, { RHAP_UI } from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import useQueryTransmission from "../../queries/useQueryTransmission";

//
//  Local Components
//

function NameField({ transmission }: { transmission?: ITransmission }) {
  if (!transmission) return <Skeleton height={45} radius="xl" />;

  return <Title h={45}>{transmission.name}</Title>;
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

function SettingsMenu() {
  return (
    <Menu position="bottom-start" shadow="md">
      {/* The button that activates the visibility of this menu */}
      <Menu.Target>
        <ActionIcon size="lg" variant="default">
          <IconAdjustments />
        </ActionIcon>
      </Menu.Target>

      {/* The contents of the menu dropdown */}
      <Menu.Dropdown>
        <Menu.Item color="red" leftSection={<IconTrash size={20} />}>
          Delete Transmission
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}

//
//  Exports
//

export interface TransmissionDetailsProps {
  id: string;
  initialData?: DbObject<ITransmission>;
}

export default function TransmissionDetails({ id, initialData }: TransmissionDetailsProps) {
  const transmission = useQueryTransmission({ id, initialData });
  // const transmission = undefined;

  return (
    <Stack>
      <Group justify="space-between" align="flex-end">
        <Stack gap="xs">
          <NameField transmission={transmission} />
          <IdField id={id} />
        </Stack>
        <SettingsMenu />
      </Group>
      <Divider />
      <StemPicker transmission={transmission} />
    </Stack>
  );
}
