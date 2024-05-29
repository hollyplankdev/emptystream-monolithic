import { Box, Divider, ScrollArea, Text } from "@mantine/core";
import TransmissionQueries from "../../queries/TransmissionQueries";
import TransmissionListElement from "./TransmissionListElement";

export default function TransmissionList() {
  const query = TransmissionQueries.useQueryAll({ initialData: [] });

  return (
    <Box>
      <Text size="lg">Transmissions</Text>
      <Divider />
      <ScrollArea scrollbars="y">
        {(query.data ?? []).map((transmission) => (
          <TransmissionListElement key={transmission._id} initialData={transmission} />
        ))}
      </ScrollArea>
    </Box>
  );
}
