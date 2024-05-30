import { DbObject, ITransmission } from "@emptystream/shared";
import { ActionIcon, Group, Modal, Paper, Stack } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconDots } from "@tabler/icons-react";
import TransmissionQueries from "../../queries/TransmissionQueries";
import TransmissionDetails from "./TransmissionDetails";
import styles from "./TransmissionListElement.module.css";
import TransmissionName from "./TransmissionName";
import TransmissionSplitProgress from "./TransmissionSplitProgress";
import TransmissionStemIcon from "./TransmissionStemIcon";

export interface TransmissionListElementProps {
  initialData: DbObject<ITransmission>;
}

//
//  Sub-Elements
//

function TransmissionDetailsMenu({
  transmission,
  isOpened,
  openFunc,
  closeFunc,
}: {
  transmission?: DbObject<ITransmission>;
  isOpened: boolean;
  openFunc: () => void;
  closeFunc: () => void;
}) {
  if (!transmission) return undefined;

  return (
    <>
      <ActionIcon onClick={openFunc} variant="transparent" color="white" size="md">
        <IconDots size="100%" stroke={2} />
      </ActionIcon>
      <Modal opened={isOpened} onClose={closeFunc}>
        <TransmissionDetails
          id={transmission._id}
          initialData={transmission}
          onDelete={closeFunc}
        />
      </Modal>
    </>
  );
}

//
//  Exported Element
//

export default function TransmissionListElement({ initialData }: TransmissionListElementProps) {
  const transmission = TransmissionQueries.useQuerySingle(initialData._id, { initialData }).data;
  const [detailsOpened, { open: openDetails, close: closeDetails }] = useDisclosure(false);

  return (
    <Paper withBorder radius={0} pl="xs" pr="xs" pt={1} pb={1} className={styles.elementButton}>
      <Group justify="flex-start">
        <TransmissionStemIcon transmission={transmission} />
        <Stack gap={0} flex={1} justify="center" mih="35px">
          <TransmissionName transmission={transmission} />
          <TransmissionSplitProgress transmission={transmission} />
        </Stack>
        <TransmissionDetailsMenu
          transmission={transmission}
          isOpened={detailsOpened}
          openFunc={openDetails}
          closeFunc={closeDetails}
        />
      </Group>
    </Paper>
  );
}
