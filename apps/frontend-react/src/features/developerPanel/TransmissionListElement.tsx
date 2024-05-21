import { DbObject, ITransmission } from "@emptystream/shared";
import { Box, Group, Loader, Text } from "@mantine/core";
import { IconExclamationCircle, IconMusic } from "@tabler/icons-react";

export interface TransmissionListElementProps {
  transmission: DbObject<ITransmission>;
}

function StemIcon({ transmission }: { transmission: ITransmission }) {
  switch (transmission.splitOperation.status) {
    case "complete":
      return <IconMusic size={24} />;

    case "failed":
      return <IconExclamationCircle size={24} />;

    default:
      return <Loader size={24} />;
  }
}

function StemStatus({ transmission }: { transmission: ITransmission }) {
  switch (transmission.splitOperation.status) {
    case "complete":
      return (
        <Group>
          {transmission.stems.map((stem) => (
            <Text key={stem} size="xs">
              {stem}
            </Text>
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
    <Group justify="flex-start">
      <StemIcon transmission={transmission} />
      <Box>
        <Text size="lg">{transmission.name}</Text>
        <Text size="xs">{transmission._id}</Text>
        <StemStatus transmission={transmission} />
      </Box>
    </Group>
  );
}
