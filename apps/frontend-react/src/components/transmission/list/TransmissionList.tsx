import { Box } from "@mantine/core";
import { useTransmissionQueryAll } from "../../../queries/transmission";
import TransmissionListElement from "./TransmissionListElement";

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
