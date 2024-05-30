import { Box, Button, Group, LoadingOverlay, Text, TextInput } from "@mantine/core";
import { Dropzone, FileWithPath } from "@mantine/dropzone";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { IconMusic, IconPhoto, IconUpload, IconX } from "@tabler/icons-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import TransmissionAPI from "../../../api/TransmissionAPI";
import isURLSafe from "../../../utils/isURLSafe";

interface FormValues {
  file: File | null;
  name: string;
}

//
//  Component
//

export interface UploadTransmissionProps {
  onComplete?: Function;
}

export default function TransmissionUploadForm({
  onComplete = undefined,
}: UploadTransmissionProps) {
  const [isLoading, { open: startLoadingDisplay, close: stopLoadingDisplay }] =
    useDisclosure(false);

  // Setup a query mutation for uploading the transmission
  const queryClient = useQueryClient();
  const uploadMutation = useMutation({
    mutationFn: (args: { name: string; audio: File }) =>
      TransmissionAPI.upload(args.name, args.audio),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["transmission", "list"] }),
  });

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

  const onFormSubmit = form.onSubmit(async () => {
    startLoadingDisplay(); // Show the loading spinner

    // Upload the new Transmission
    await uploadMutation.mutateAsync({ name: form.values.name, audio: form.values.file as File });

    stopLoadingDisplay(); // Hide the loading spinner
    form.reset(); // Clean form in case we wanna re-use it

    // Tell us that we are done!
    if (onComplete) onComplete();
  });

  return (
    <Box maw={340} mx="auto">
      <LoadingOverlay visible={isLoading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
      <form onSubmit={onFormSubmit}>
        {/* The input allowing an audio file to be selected */}
        <Dropzone
          onDrop={onGoodFiles}
          onReject={onBadFiles}
          multiple={false}
          accept={{ "audio/mpeg": [".mp3"] }}
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
          placeholder="something_cool"
          disabled={form.values.file === null}
          {...form.getInputProps("name")}
        />
        <Group justify="end" mt="md">
          <Button type="submit">Submit</Button>
        </Group>
      </form>
    </Box>
  );
}
