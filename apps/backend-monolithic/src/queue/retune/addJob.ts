import { ChannelTuning } from "@emptystream/shared";
import { queue } from "./queue.js";

/**
 * Add a delayed transmission-retune event to the queue.
 *
 * @param tunings The new channel tunings to apply to the stream state.
 * @param delay The delay of this retune, in milliseconds.
 */
export default function addJob(tunings: ChannelTuning[], delay: number) {
  let operationName = "retune";
  tunings.forEach((tuning) => {
    operationName += `_[${tuning.index}_to_${tuning.transmission.id}:${tuning.transmission.stem}]`;
  });

  // ...then tell our queue that we want to split this audio!
  return queue.add(operationName, { tunings }, { delay });
}
