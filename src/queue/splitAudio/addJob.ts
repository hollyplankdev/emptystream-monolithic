import { queue } from "./queue.js";

/**
 * Add an audio split operation to the queue.
 *
 * @param transmissionId The ID of the transmission to split.
 * @param transmissionName The name of the transmission that we're splitting.
 */
export default function addJob(transmissionId: string, transmissionName: string) {
  // ...then tell our queue that we want to split this audio!
  return queue.add(`split_${transmissionName}`, {
    transmissionId,
    transmissionName,
  });
}
