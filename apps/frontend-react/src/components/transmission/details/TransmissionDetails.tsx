import { DbObject, ITransmission } from "@emptystream/shared";
import { Divider, Group, LoadingOverlay, Stack } from "@mantine/core";
import "react-h5-audio-player/lib/styles.css";
import TransmissionQueries from "../../../queries/TransmissionQueries";
import DatabaseId from "../../DatabaseId";
import TransmissionDetailsMenu from "./TransmissionDetailsMenu";
import TransmissionName from "../TransmissionName";
import TransmissionStemPicker from "../TransmissionStemPicker";

export interface TransmissionDetailsProps {
  /** The known ID of the Transmission to display details about. */
  id: string;

  /**
   * The information that we currently know about this transmission, if there is any. The ID in this
   * object should match the ID provided above.
   */
  initialData?: DbObject<ITransmission>;

  /** Called when the user chooses to delete this Transmission. */
  onDelete?: () => void;
}

export default function TransmissionDetails({
  id,
  initialData,
  onDelete,
}: TransmissionDetailsProps) {
  const removeMutation = TransmissionQueries.useMutationRemove(id, { onSuccess: onDelete });
  const transmission = TransmissionQueries.useQuerySingle(id, { initialData }).data;

  return (
    <Stack>
      {/* The loading overlay to display while this transmission is being deleted. */}
      <LoadingOverlay
        visible={removeMutation.isPending}
        loaderProps={{ children: "Removing..." }}
      />

      {/* Information about this Transmission */}
      <Stack gap={0}>
        <TransmissionName
          transmission={transmission}
          fontSize="20pt"
          fontWeight={700}
          skeletonHeight={45}
        />
        <Group justify="space-between" align="flex-end">
          <DatabaseId id={id} />

          {/* Additional actions available through this dropdown */}
          <TransmissionDetailsMenu transmission={transmission} onDelete={removeMutation.mutate} />
        </Group>
      </Stack>
      <Divider />

      {/* Allow playing the stems of this Transmission */}
      <TransmissionStemPicker transmission={transmission} />
    </Stack>
  );
}
