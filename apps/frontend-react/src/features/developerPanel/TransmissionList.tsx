import { ScrollArea } from "@mantine/core";
import TransmissionQueries from "../../queries/TransmissionQueries";
import TransmissionListElement from "./TransmissionListElement";

export default function TransmissionList() {
  const query = TransmissionQueries.useQueryAll({ initialData: [] });

  return (
    <ScrollArea scrollbars="y">
      {(query.data ?? []).map((transmission) => (
        <TransmissionListElement key={transmission._id} initialData={transmission} />
      ))}
    </ScrollArea>
  );
}
