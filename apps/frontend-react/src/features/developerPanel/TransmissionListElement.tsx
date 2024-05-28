import { DbObject, ITransmission } from "@emptystream/shared";
import { Group, Loader, Paper, Progress, Stack, Text } from "@mantine/core";
import { IconExclamationCircle, IconMusic } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import TransmissionAPI from "../../api/TransmissionAPI";
import styles from "./TransmissionListElement.module.css";

export interface TransmissionListElementProps {
  initialData: DbObject<ITransmission>;
}

//
//  Sub-Elements
//

function StemIcon({ transmission }: { transmission: ITransmission }) {
  switch (transmission.splitOperation.status) {
    case "complete":
      return <IconMusic size={20} />;

    case "failed":
      return <IconExclamationCircle size={20} />;

    default:
      return <Loader size={20} />;
  }
}

function TransmissionProgress({ transmission }: { transmission: ITransmission }) {
  // If we're already done splitting, exit early
  if (transmission.splitOperation.status === "complete") return undefined;

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
    <Paper withBorder radius={0} pl="xs" pr="xs" pt={1} pb={1} className={styles.elementButton}>
      <Group justify="flex-start">
        <StemIcon transmission={transmission} />
        <Stack gap={0} flex={1} justify="center" mih="35px">
          <Text size="md">{transmission.name}</Text>
          <TransmissionProgress transmission={transmission} />
        </Stack>
      </Group>
    </Paper>
  );
}
