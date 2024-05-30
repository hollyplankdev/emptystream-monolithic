import { ITransmission } from "@emptystream/shared";
import { Skeleton, SkeletonProps, Text, TextProps } from "@mantine/core";

//
//  Exports
//

export interface TransmissionNameProps {
  /**
   * OPTIONAL - The transmission to display the name of. If not provided, the component will render
   * as a skeleton.
   */
  transmission?: ITransmission;

  /** OPTIONAL - The size of the text's font. */
  fontSize?: TextProps["size"];
  /** OPTIONAL - The weight of the text's font */
  fontWeight?: TextProps["fw"];

  /** OPTIONAL - The height to use for the skeleton of this component. */
  skeletonHeight?: SkeletonProps["height"];
}

/** @returns Text showing the name of a Transmission. Supports being rendered as a skeleton. */
export default function TransmissionName({
  transmission,
  fontSize,
  fontWeight,
  skeletonHeight,
}: TransmissionNameProps) {
  if (!transmission) return <Skeleton height={skeletonHeight} radius="xl" />;

  return (
    <Text size={fontSize} mih={skeletonHeight} fw={fontWeight} style={{ wordBreak: "break-word" }}>
      {transmission.name}
    </Text>
  );
}
