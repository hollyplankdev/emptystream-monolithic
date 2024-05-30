import { DbObject, ITransmission } from "@emptystream/shared";
import { SegmentedControl, Stack } from "@mantine/core";
import { useState } from "react";
import TransmissionStemPlayer from "./TransmissionStemPlayer";

export interface TransmissionStemPickerProps {
  transmission?: DbObject<ITransmission>;
}

export default function TransmissionStemPicker({ transmission }: TransmissionStemPickerProps) {
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
      <TransmissionStemPlayer transmission={transmission} stem={pickedStem} />
    </Stack>
  );
}
