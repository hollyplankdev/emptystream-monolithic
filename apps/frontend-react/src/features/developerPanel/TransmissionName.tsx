import { ITransmission } from "@emptystream/shared";
import { Skeleton, SkeletonProps, Text, TextProps } from "@mantine/core";

//
//  Exports
//

export interface TransmissionNameProps {
  transmission?: ITransmission;
  fontSize?: TextProps["size"];
  fontWeight?: TextProps["fw"];
  skeletonHeight?: SkeletonProps["height"];
}

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
