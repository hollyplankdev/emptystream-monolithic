import { DbObject, ITransmission } from "@emptystream/shared";
import { Group, Paper, Stack } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import TransmissionQueries from "../../../queries/TransmissionQueries";
import TransmissionListElementMenu from "./TransmissionListElementMenu";
import styles from "./TransmissionListElement.module.css";
import TransmissionName from "../TransmissionName";
import TransmissionSplitProgress from "../TransmissionSplitProgress";
import TransmissionStemIcon from "../TransmissionStemIcon";

export interface TransmissionListElementProps {
  initialData: DbObject<ITransmission>;
}

export default function TransmissionListElement({ initialData }: TransmissionListElementProps) {
  const transmission = TransmissionQueries.useQuerySingle(initialData._id, { initialData }).data;
  const [detailsOpened, { open: openDetails, close: closeDetails }] = useDisclosure(false);

  return (
    <Paper withBorder radius={0} pl="xs" pr="xs" pt={1} pb={1} className={styles.elementButton}>
      <Group justify="flex-start">
        <TransmissionStemIcon transmission={transmission} />
        <Stack gap={0} flex={1} justify="center" mih="35px">
          <TransmissionName
            transmission={transmission}
            fontSize="md"
            fontWeight={400}
            skeletonHeight={8}
          />
          <TransmissionSplitProgress transmission={transmission} />
        </Stack>
        <TransmissionListElementMenu
          transmission={transmission}
          isOpened={detailsOpened}
          openFunc={openDetails}
          closeFunc={closeDetails}
        />
      </Group>
    </Paper>
  );
}
