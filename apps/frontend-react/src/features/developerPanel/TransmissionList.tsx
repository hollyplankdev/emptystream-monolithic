import { Text, Divider } from "@mantine/core";
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
    <>
      <Text size="lg">Transmissions</Text>
      <Divider />
      <ul>
        {query.data.map((transmission) => (
          <TransmissionListElement key={transmission._id} initialData={transmission} />
        ))}
      </ul>
    </>
  );
}
