import { Button, Drawer } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import styles from "./DeveloperPanel.module.css";
import UploadTransmissionButton from "./UploadTransmissionButton";
import TransmissionList from "./TransmissionList";

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
        <UploadTransmissionButton />
        {/* <TransmissionList /> */}
      </Drawer>

      <Button className={styles.devPanelButton} onClick={open}>
        Developer Panel
      </Button>
    </div>
  );
}
