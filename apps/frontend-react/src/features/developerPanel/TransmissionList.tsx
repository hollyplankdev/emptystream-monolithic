import { Box, Divider, ScrollArea, Text } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import TransmissionAPI from "../../api/TransmissionAPI";
import TransmissionListElement from "./TransmissionListElement";

export default function TransmissionList() {
  const query = useQuery({
    queryKey: ["transmission", "list"],
    queryFn: TransmissionAPI.all,
    initialData: [],
  });

  return (
    <Box>
      <Text size="lg">Transmissions</Text>
      <Divider />
      <ScrollArea scrollbars="y">
        {query.data.map((transmission) => (
          <TransmissionListElement key={transmission._id} initialData={transmission} />
        ))}
      </ScrollArea>
    </Box>
  );
}
