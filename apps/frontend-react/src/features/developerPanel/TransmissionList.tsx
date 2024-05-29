import { Box } from "@mantine/core";
import TransmissionQueries from "../../queries/TransmissionQueries";
import TransmissionListElement from "./TransmissionListElement";

export default function TransmissionList() {
  const query = TransmissionQueries.useQueryAll({ initialData: [] });

  return (
    <Box>
      {(query.data ?? []).map((transmission) => (
        <TransmissionListElement key={transmission._id} initialData={transmission} />
      ))}
    </Box>
  );
}
