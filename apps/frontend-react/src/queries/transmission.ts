import { DbObject, ITransmission } from "@emptystream/shared";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  apiCreateTransmission,
  apiGetTransmission,
  apiListAllTransmissions,
  apiRemoveTransmission,
} from "../api/transmission";

//
//  Keys
//

/**
 * @param id The ID of the transmission being referenced.
 * @returns The TanStack Query key to use when getting a single transmission.
 */
function singleTransmissionKey(id: string) {
  return ["transmission", "id", id];
}

/** @returns The TanStack Query key to use when listing all transmissions. */
function allTransmissionKey() {
  return ["transmission", "list"];
}

//
//  Queries
//

/**
 * A hook that queries the API for a single transmission by it's ID. This dynamically updates it's
 * refetch time depending on if the Transmission is actively being split.
 *
 * @param id The ID of the transmission to get.
 * @param options.initialData OPTIONAL - Initial values to use while the query gets the real results
 *   from the API.
 * @returns The described query.
 */
export function useTransmissionQuerySingle(
  id: string,
  options: { initialData?: DbObject<ITransmission> } = {},
) {
  const { initialData } = options;

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
    queryFn: () => apiGetTransmission(id),
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

/**
 * A hook that queries the API for ALL known Transmissions.
 *
 * @param options.initialData OPTIONAL - Initial values to use while the query gets the real results
 *   from the API.
 * @returns The described query.
 */
export function useTransmissionQueryAll(options: { initialData?: DbObject<ITransmission>[] } = {}) {
  const { initialData } = options;

  return useQuery({
    queryKey: allTransmissionKey(),
    queryFn: apiListAllTransmissions,
    initialData,
  });
}

//
//  Mutations
//

/**
 * A hook that allows you to create a new Transmission in the API, and keep track of the status of
 * said operation. This will automatically invalidate queries that might return the new
 * transmission.
 *
 * @param options.onSuccess OPTIONAL - A callback called if this mutation succeeds.
 * @param options.onError OPTIONAL - A callback called if this mutation encounters some error.
 * @returns The described mutation.
 */
export function useTransmissionMutationCreate(
  options: { onSuccess?: () => void; onError?: (err: Error) => void } = {},
) {
  const { onSuccess, onError } = options;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (args: { name: string; audio: File }) =>
      apiCreateTransmission(args.name, args.audio),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: allTransmissionKey() });
      if (onSuccess) onSuccess();
    },
    onError,
  });
}

/**
 * A hook that allows you to remove a Transmission from the API, and keep track of the status of
 * said operation. This will automatically invalidate queries that might return the transmission
 * being removed.
 *
 * @param id The ID of the transmission to remove.
 * @param options.onSuccess OPTIONAL - A callback called if this mutation succeeds.
 * @param options.onError OPTIONAL - A callback called if this mutation encounters some error.
 * @returns The described mutation.
 */
export function useTransmissionMutationRemove(
  id: string,
  options: { onSuccess?: () => void; onError?: (err: Error) => void } = {},
) {
  const { onSuccess, onError } = options;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => apiRemoveTransmission(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: allTransmissionKey() });
      queryClient.invalidateQueries({ queryKey: singleTransmissionKey(id) });
      if (onSuccess) onSuccess();
    },
    onError,
  });
}
