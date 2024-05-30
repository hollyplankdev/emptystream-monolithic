import { ITransmission } from "@emptystream/shared";
import { Loader, Skeleton } from "@mantine/core";
import { IconExclamationCircle, IconMusic } from "@tabler/icons-react";

export interface TransmissionStemIconProps {
  /**
   * OPTIONAL - The transmission to display an icon for. If not provided, the component will render
   * as a skeleton.
   */
  transmission?: ITransmission;

  /** The size for the width and height of this icon. @default 20 */
  size?: number;
}

/**
 * @returns An icon representing the current state of a Transmission. Supports being rendered as a
 *   skeleton.
 */
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
