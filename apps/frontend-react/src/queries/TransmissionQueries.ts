import { DbObject, ITransmission } from "@emptystream/shared";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import TransmissionAPI from "../api/TransmissionAPI";

//
//  Keys
//

function singleTransmissionKey(id: string) {
  return ["transmission", "id", id];
}

function allTransmissionKey() {
  return ["transmission", "list"];
}

//
//  Queries
//

/** Query getting a single transmission from the API. */
function useQuerySingle(
  id: string,
  {
    initialData,
    refetchInterval,
  }: { initialData?: DbObject<ITransmission>; refetchInterval?: number | false },
) {
  return useQuery({
    queryKey: singleTransmissionKey(id),
    queryFn: () => TransmissionAPI.get(id),
    staleTime: 1000 * 60,
    initialData,
    refetchInterval,
  });
}

/** Query getting ALL transmissions from the API. */
function useQueryAll({ initialData }: { initialData?: DbObject<ITransmission>[] }) {
  return useQuery({
    queryKey: allTransmissionKey(),
    queryFn: TransmissionAPI.all,
    initialData,
  });
}

//
//  Mutations
//

/** Mutation that removes a transmission from the API. */
function useMutationRemove(
  id: string,
  { onSuccess, onError }: { onSuccess?: () => void; onError?: (err: Error) => void } = {},
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => TransmissionAPI.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: allTransmissionKey() });
      queryClient.invalidateQueries({ queryKey: singleTransmissionKey(id) });
      if (onSuccess) onSuccess();
    },
    onError,
  });
}

//
//  Export
//

export default {
  useQuerySingle,
  useQueryAll,
  useMutationRemove,
};
