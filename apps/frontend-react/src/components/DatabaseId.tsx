import { Text } from "@mantine/core";

export interface DatabaseIdProps {
  /** The database ID to display. Can be undefined if it's not known. */
  id?: string;
}

/** @returns A text object displaying a database ID. */
export default function DatabaseId({ id }: DatabaseIdProps) {
  return <Text>{id ?? "UNKNOWN_ID"}</Text>;
}
