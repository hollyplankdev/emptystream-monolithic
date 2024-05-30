import { Box } from "@mantine/core";
import { useTransmissionQueryAll } from "../../../queries/transmission";
import TransmissionListElement from "./TransmissionListElement";

/** @returns A list of all Transmissions in the API. */
export default function TransmissionList() {
  const query = useTransmissionQueryAll({ initialData: [] });

  return (
    <Box>
      {(query.data ?? []).map((transmission) => (
        <TransmissionListElement key={transmission._id} initialData={transmission} />
      ))}
    </Box>
  );
}
