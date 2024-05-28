import { DbObject, ITransmission } from "@emptystream/shared";
import { Divider, Paper, SegmentedControl, Skeleton, Stack, Text, Title } from "@mantine/core";
import { useState } from "react";
import useQueryTransmission from "../../queries/useQueryTransmission";
import AudioPlayer, { RHAP_UI } from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";

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
      <Stack gap="xs">
        <NameField transmission={transmission} />
        <IdField id={id} />
      </Stack>
      <Divider />
      <StemPicker transmission={transmission} />
    </Stack>
  );
}
