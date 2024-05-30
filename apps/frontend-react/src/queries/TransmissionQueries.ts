import { DbObject, ITransmission } from "@emptystream/shared";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import TransmissionAPI from "../api/TransmissionAPI";
import { useState } from "react";

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
function useQuerySingle(id: string, { initialData }: { initialData?: DbObject<ITransmission> }) {
  /**
   * Configure a state for our refetch interval. We do this because we conditionally want to refetch
   * depending on the state of the transmission itself.
   */
  const [refetchInterval, setRefetchInterval] = useState<number | false>(false);

  // How often to refetch if the transmission is actively being split.
  const refetchIntervalWhenSplitting = 1000 * 1;

  // Make the actual query
  const query = useQuery({
    queryKey: singleTransmissionKey(id),
    queryFn: () => TransmissionAPI.get(id),
    staleTime: 1000 * 60,
    initialData,
    refetchInterval,
  });

  // If we're still loading the query, EXIT EARLY
  if (!query.data) return query;

  // Adjust the refetch interval depending on the split operation status
  switch (query.data.splitOperation.status) {
    /** If this query is not loading, mark that it shouldn't auto refresh */
    case "complete":
    case "failed":
      if (refetchInterval !== false) setRefetchInterval(false);
      break;

    /** If this query is still loading, mark that it should refresh every so often. */
    default:
      if (refetchInterval !== refetchIntervalWhenSplitting) {
        setRefetchInterval(refetchIntervalWhenSplitting);
      }
      break;
  }

  return query;
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
