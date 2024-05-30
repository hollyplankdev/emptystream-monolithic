import { ITransmission } from "@emptystream/shared";
import { Progress } from "@mantine/core";

export interface TransmissionSplitProgressProps {
  transmission?: ITransmission;
}

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
