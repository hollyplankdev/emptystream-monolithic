import { Text } from "@mantine/core";
import { Dropzone } from "@mantine/dropzone";
import { IconUpload, IconPhoto, IconX } from "@tabler/icons-react";

export default function UploadTransmission() {
  const onGivenFiles = (files) => {
    console.log(files);
  };

  return (
    <>
      <Dropzone onDrop={onGivenFiles} accept={{ "audio/mpeg": [".mp3  "] }}>
        {/* When the hovered file is valid */}
        <Dropzone.Accept>
          <IconUpload />
        </Dropzone.Accept>

        {/* When the hovered file is invalid */}
        <Dropzone.Reject>
          <IconX />
        </Dropzone.Reject>

        {/* When nothing is happening */}
        <Dropzone.Idle>
          <IconPhoto />
        </Dropzone.Idle>

        <div>
          <Text size="x1" inline>
            Click to upload MP3 audio.
          </Text>
          <Text size="sm">Only one file can be uploaded at a time!</Text>
        </div>
      </Dropzone>
      <Text>huh.</Text>
    </>
  );
}
