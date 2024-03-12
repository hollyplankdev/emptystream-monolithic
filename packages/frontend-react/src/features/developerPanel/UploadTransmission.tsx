import { Box, Button, Group, Text, TextInput } from "@mantine/core";
import { Dropzone, FileWithPath } from "@mantine/dropzone";
import { useForm } from "@mantine/form";
import { IconMusic, IconPhoto, IconUpload, IconX } from "@tabler/icons-react";
import isURLSafe from "../../utils/isURLSafe";

interface FormValues {
  file: File | null;
  name: string;
}

export default function UploadTransmission() {
  const form = useForm<FormValues>({
    initialValues: {
      file: null,
      name: "",
    },
    validate: {
      // Make sure that the file field is set correctly
      file: (value) => (value !== null ? null : "No file selected"),
      name: (value) => (isURLSafe(value) ? null : "Name isn't URL safe"),
    },
  });

  const onGoodFiles = (files: FileWithPath[]) => {
    form.clearFieldError("file");
    form.setFieldValue("file", files[0]);

    if (files[0].path) {
      form.setFieldValue("name", files[0].name.replace(".mp3", ""));
    } else {
      form.setFieldValue("name", "");
    }
  };

  const onBadFiles = () => {
    form.setFieldError("file", "Invalid file selected");
    form.setFieldValue("name", "");
  };

  const onFormSubmit = form.onSubmit(() => {
    // TODO
    console.log("TODO");
  });

  return (
    <Box maw={340} mx="auto">
      <form onSubmit={onFormSubmit}>
        {/* The input allowing an audio file to be selected */}
        <Dropzone
          onDrop={onGoodFiles}
          onReject={onBadFiles}
          multiple={false}
          accept={{ "audio/mpeg": [".mp3  "] }}
        >
          <Group justify="center" gap="x1" mih={80} style={{ pointerEvents: "none" }}>
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
              {form.values.file !== null ? <IconMusic /> : <IconPhoto />}
            </Dropzone.Idle>

            <div>
              <Text size="x1" inline>
                {form.values.file !== null ? form.values.file.name : "Click to upload MP3 audio."}
              </Text>
              <Text size="sm">
                {form.values.file === null ? "Only one file can be uploaded at a time!" : ""}
              </Text>
            </div>
          </Group>
        </Dropzone>

        {/* Display errors with the selected file, if there are any. */}
        {form.errors.file && (
          <Text c="red" mt={5} size="xs">
            {form.errors.file}
          </Text>
        )}

        {/* The input allowing the name of the transmission to be set */}
        <TextInput
          label="Transmission Name"
          placeholder="somethingcool"
          disabled={form.values.file === null}
          {...form.getInputProps("name")}
        />
        <Group justify="end" mt="md">
          <Button type="submit">Submit</Button>
        </Group>
        <Text>huh.</Text>
      </form>
    </Box>
  );
}
