import { useQuery } from "@tanstack/react-query";

const getTransmissions = async () => {};

export default function TransmissionList() {
  const query = useQuery({ queryKey: ["transmission", "list"], queryFn: getTransmissions });

  return <div>Hello world!</div>;
}
