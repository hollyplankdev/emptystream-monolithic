import { Button, Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import UploadTransmission from "./UploadTransmission";

/** The ID to use when opening / closing the UploadTransmission modal. */
const modalId = "uploadTransmissionModal";

export default function UploadTransmissionButton() {
  const closeUploadTransmission = () => {
    modals.close(modalId);
  };

  const openUploadTransmission = () =>
    modals.open({
      title: <Text size="lg">Upload a new Transmission to `emptystream`</Text>,
      children: <UploadTransmission onComplete={closeUploadTransmission} />,
      modalId,
    });

  return <Button onClick={openUploadTransmission}>Upload Transmission</Button>;
}
