import { Box, Text, Group } from "@mantine/core";
import { DbObject, ITransmission } from "@emptystream/shared";

export interface TransmissionListElementProps {
  transmission: DbObject<ITransmission>;
}

function StemStatus({ transmission }: { transmission: ITransmission }) {
  switch (transmission.splitOperation.status) {
    case "complete":
      return (
        <Group>
          {transmission.stems.map((stem) => (
            <Text size="xs">{stem}</Text>
          ))}
        </Group>
      );

    case "failed":
      return <Text size="xs">Split Error @ {transmission.splitOperation.percentage}%</Text>;

    default:
      return <Text size="xs">Split Progress {transmission.splitOperation.percentage}%</Text>;
  }
}

export default function TransmissionListElement({ transmission }: TransmissionListElementProps) {
  return (
    <Box mx="auto">
      <Text size="lg">{transmission.name}</Text>
      <Text size="xs">{transmission._id}</Text>
      <StemStatus transmission={transmission} />
    </Box>
  );
}
