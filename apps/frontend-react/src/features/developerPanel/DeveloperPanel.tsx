import { ActionIcon, Button, Divider, Drawer, Group, Menu, Stack, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconMenu2, IconUpload } from "@tabler/icons-react";
import styles from "./DeveloperPanel.module.css";
import TransmissionList from "./TransmissionList";
import TransmissionUploadModal from "./TransmissionUploadModal";

//
//  Local Components
//

function TransmissionDeveloperMenu() {
  const [isUploadModalOpen, { open: openUploadModal, close: closeUploadModal }] =
    useDisclosure(false);

  return (
    <>
      <Menu position="bottom-end">
        <Menu.Target>
          <ActionIcon variant="default">
            <IconMenu2 />
          </ActionIcon>
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Item leftSection={<IconUpload size={20} />} onClick={openUploadModal}>
            Upload New
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
      <TransmissionUploadModal isOpen={isUploadModalOpen} close={closeUploadModal} />
    </>
  );
}

//
//  Exports
//

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
          <Group justify="space-between">
            <Title order={2}>Transmissions</Title>
            <TransmissionDeveloperMenu />
          </Group>
          <Divider />
          <TransmissionList />
        </Stack>
      </Drawer>

      <Button className={styles.devPanelButton} onClick={open}>
        Developer Panel
      </Button>
    </div>
  );
}
