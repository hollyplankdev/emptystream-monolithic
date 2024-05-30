import { Text } from "@mantine/core";

export interface DatabaseIdProps {
  id: string | undefined;
}

export default function DatabaseId({ id }: DatabaseIdProps) {
  return <Text>{id ?? "UNKNOWN_ID"}</Text>;
}
