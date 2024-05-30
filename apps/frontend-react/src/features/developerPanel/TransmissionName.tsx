import { ITransmission } from "@emptystream/shared";
import { Box, Skeleton, Text } from "@mantine/core";

// TODO - allow supporting different sizes

export interface TransmissionNameProps {
  transmission?: ITransmission;
}

export default function TransmissionName({ transmission }: TransmissionNameProps) {
  if (!transmission) return <Skeleton height={8} />;
  return (
    <Box maw={300}>
      <Text size="md" truncate="end">
        {transmission.name}
      </Text>
    </Box>
  );
}
