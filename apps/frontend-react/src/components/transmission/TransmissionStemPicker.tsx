import { DbObject, ITransmission } from "@emptystream/shared";
import { SegmentedControl, Stack } from "@mantine/core";
import { useState } from "react";
import TransmissionStemPlayer from "./TransmissionStemPlayer";

export interface TransmissionStemPickerProps {
  /**
   * OPTIONAL - The transmission to pick stems from. If not provided, the component will render as a
   * skeleton.
   */
  transmission?: DbObject<ITransmission>;
}

/**
 * @returns A segmented control configured to allow for picking between different stems and
 *   displaying a player for each one. Supports being rendered as a skeleton.
 */
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
