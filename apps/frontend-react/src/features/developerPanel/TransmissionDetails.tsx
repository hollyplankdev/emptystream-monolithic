import { DbObject, ITransmission } from "@emptystream/shared";
import { Skeleton, Stack, Text } from "@mantine/core";
import useQueryTransmission from "../../queries/useQueryTransmission";

//
//  Local Components
//

function NameField({ transmission }: { transmission?: ITransmission }) {
  if (!transmission) return <Skeleton height={8} />;
  return <Text>{transmission?.name}</Text>;
}

//
//  Exports
//

export interface TransmissionDetailsProps {
  id: string;
  initialData?: DbObject<ITransmission>;
}

export default function TransmissionDetails({ id, initialData }: TransmissionDetailsProps) {
  const transmission = useQueryTransmission({ id, initialData });

  return (
    <Stack>
      <NameField transmission={transmission} />
    </Stack>
  );
}
