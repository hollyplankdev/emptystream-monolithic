import { ActionIcon, Button, Divider, Drawer, Group, Menu, Stack, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconMenu2, IconUpload } from "@tabler/icons-react";
import styles from "./DeveloperPanel.module.css";
import TransmissionList from "./transmission/list/TransmissionList";
import TransmissionUploadModal from "./transmission/upload/TransmissionUploadModal";

//
//  Local Components
//

/**
 * @returns A menu that presents actions to take on Transmissions. Allows for uploading new
 *   transmissions.
 */
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

/**
 * @returns A button that opens a drawer containing developer tools. Developers can manage
 *   Transmissions via this panel.
 */
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
