import { Button, Divider, Drawer, Group, Stack, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import styles from "./DeveloperPanel.module.css";
import TransmissionList from "./TransmissionList";
import UploadTransmissionButton from "./UploadTransmissionButton";

export default function DeveloperPanel() {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <div className={styles.container}>
      <Drawer
        opened={opened}
        onClose={close}
        title="Developer Panel"
        position="right"
        overlayProps={{ backgroundOpacity: 0.5, blur: 2 }}
      >
        <Stack>
          <Title order={2}>Transmissions</Title>
          <Divider />
          <Group justify="flex-start">
            <UploadTransmissionButton />
          </Group>
          <TransmissionList />
        </Stack>
      </Drawer>

      <Button className={styles.devPanelButton} onClick={open}>
        Developer Panel
      </Button>
    </div>
  );
}
