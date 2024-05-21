import { DbObject, ITransmission } from "@emptystream/shared";
import { Box, Group, Loader, Text } from "@mantine/core";
import { IconExclamationCircle, IconMusic } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import TransmissionAPI from "../../api/TransmissionAPI";

export interface TransmissionListElementProps {
  initialData: DbObject<ITransmission>;
}

//
//  Sub-Elements
//

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

//
//  Sub-Hooks
//

function useTransmission(initialData: DbObject<ITransmission>) {
  // Setup - how often should we refetch?
  const [refetchInterval, setRefetchInterval] = useState<number | false>(false);

  const query = useQuery({
    queryKey: ["transmission", "id", initialData._id],
    queryFn: () => TransmissionAPI.get(initialData._id),
    staleTime: 1000 * 60,
    refetchInterval,
    initialData,
  });

  switch (query.data.splitOperation.status) {
    /** If this query is not loading, mark that it shouldn't auto refresh */
    case "complete":
    case "failed":
      if (refetchInterval !== false) setRefetchInterval(false);
      break;

    /** If this query is still loading, mark that it should refresh every so often. */
    default:
      if (refetchInterval !== 1000 * 1) setRefetchInterval(1000 * 1);
      break;
  }

  return query.data;
}

//
//  Exported Element
//

export default function TransmissionListElement({ initialData }: TransmissionListElementProps) {
  const transmission = useTransmission(initialData);

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
