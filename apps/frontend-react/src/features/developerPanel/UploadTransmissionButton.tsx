import { Button, Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import UploadTransmission from "./UploadTransmission";

/** The ID to use when opening / closing the UploadTransmission modal. */
const modalId = "uploadTransmissionModal";

export default function UploadTransmissionButton() {
  /** The function to call when the Transmission upload is finished. */
  const onUploadComplete = () => {
    modals.close(modalId);
  };

  /** Opens a modal containing the UploadTransmission component. */
  const openUploadTransmission = () =>
    modals.open({
      title: <Text size="lg">Upload a new Transmission to `emptystream`</Text>,
      children: <UploadTransmission onComplete={onUploadComplete} />,
      modalId,
    });

  return <Button onClick={openUploadTransmission}>Upload Transmission</Button>;
}
