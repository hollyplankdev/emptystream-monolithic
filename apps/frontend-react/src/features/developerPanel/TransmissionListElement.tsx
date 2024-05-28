import { DbObject, ITransmission } from "@emptystream/shared";
import {
  ActionIcon,
  Group,
  Loader,
  Modal,
  Paper,
  Progress,
  Skeleton,
  Stack,
  Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconDots, IconExclamationCircle, IconMusic } from "@tabler/icons-react";
import useQueryTransmission from "../../queries/useQueryTransmission";
import TransmissionDetails from "./TransmissionDetails";
import styles from "./TransmissionListElement.module.css";

export interface TransmissionListElementProps {
  initialData: DbObject<ITransmission>;
}

//
//  Sub-Elements
//

function StemIcon({ transmission }: { transmission?: ITransmission }) {
  if (!transmission) return <Skeleton height={20} circle />;

  switch (transmission.splitOperation.status) {
    case "complete":
      return <IconMusic size={20} />;

    case "failed":
      return <IconExclamationCircle size={20} />;

    default:
      return <Loader size={20} />;
  }
}

function TransmissionName({ transmission }: { transmission?: ITransmission }) {
  if (!transmission) return <Skeleton height={8} />;
  return <Text size="md">{transmission.name}</Text>;
}

function TransmissionProgress({ transmission }: { transmission?: ITransmission }) {
  // If we're already done splitting, exit early
  if (!transmission || transmission.splitOperation.status === "complete") return undefined;

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
      <Modal opened={isOpened} onClose={closeFunc} title={`Transmission: "${transmission.name}"`}>
        <TransmissionDetails id={transmission._id} initialData={transmission} />
      </Modal>
    </>
  );
}

//
//  Exported Element
//

export default function TransmissionListElement({ initialData }: TransmissionListElementProps) {
  const transmission = useQueryTransmission({ id: initialData._id, initialData });
  const [detailsOpened, { open: openDetails, close: closeDetails }] = useDisclosure(false);

  return (
    <Paper withBorder radius={0} pl="xs" pr="xs" pt={1} pb={1} className={styles.elementButton}>
      <Group justify="flex-start">
        <StemIcon transmission={transmission} />
        <Stack gap={0} flex={1} justify="center" mih="35px">
          <TransmissionName transmission={transmission} />
          <TransmissionProgress transmission={transmission} />
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
