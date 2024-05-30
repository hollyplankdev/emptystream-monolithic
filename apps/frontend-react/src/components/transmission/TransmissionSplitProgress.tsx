import { ITransmission } from "@emptystream/shared";
import { Progress } from "@mantine/core";

export interface TransmissionSplitProgressProps {
  /**
   * OPTIONAL - The transmission to display the split progress for. If not provided, the component
   * will not render.
   */
  transmission?: ITransmission;
}

/**
 * A progress bar that shows the state of a Transmission's ongoing split operation. Doesn't render
 * if there's no transmission or if the split operation is complete.
 */
export default function TransmissionSplitProgress({
  transmission,
}: TransmissionSplitProgressProps) {
  // If we're already done splitting, exit early
  if (!transmission || transmission.splitOperation.status === "complete") return undefined;

  const isError = transmission.splitOperation.status === "failed";
  const color = isError ? "red" : "blue";

  return (
    <Progress
      h="5px"
      value={transmission.splitOperation.percentage}
      color={color}
      animated={!isError}
    />
  );
}
