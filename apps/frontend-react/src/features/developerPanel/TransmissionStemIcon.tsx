import { ITransmission } from "@emptystream/shared";
import { Loader, Skeleton } from "@mantine/core";
import { IconExclamationCircle, IconMusic } from "@tabler/icons-react";

export interface TransmissionStemIconProps {
  transmission?: ITransmission;
  size?: number;
}

export default function TransmissionStemIcon({
  transmission,
  size = 20,
}: TransmissionStemIconProps) {
  if (!transmission) return <Skeleton height={size} circle />;

  switch (transmission.splitOperation.status) {
    case "complete":
      return <IconMusic size={size} />;

    case "failed":
      return <IconExclamationCircle size={size} />;

    default:
      return <Loader size={size} />;
  }
}
