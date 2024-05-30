import { Processor } from "bullmq";
import { ChannelIndex } from "@emptystream/shared";
import { StreamState } from "../../models/streamState.js";
import { Transmission } from "../../models/transmission.js";
import addJob from "./addJob.js";
import { IRetuneInput } from "./interfaces.js";

//
//
//  Main Job Function
//
//

/**
 * Runs the retuning job. Meant to be called by a BullMQ worker.
 *
 * @param job
 */
const runJob: Processor<IRetuneInput> = async (job) => {
  // Get the current stream state
  const state = await StreamState.findOrCreateSingleton();

  // Retune the channels in the stream state
  await state.retune(job.data.tunings);
  await job.updateProgress({ percentage: 70, status: "retune_complete" });

  // Get a list of all valid transmissions
  const validTransmissions = await Transmission.find({
    // Find transmissions that have finished being split into stems.
    splitOperation: { status: "complete", percentage: 100 },

    // Hack - only load transmissions with all stems. Had trouble getting the size operator to work,
    // this'll do for now.
    stems: { $in: ["vocals", "bass", "other", "drums"] },
  });
  await job.updateProgress({ percentage: 80, status: "loaded_transmissions" });
  // console.log(`Found ${validTransmissions.length} transmissions`);

  // If there are no valid transmissions, then just try to retune in 10 seconds, and hope that
  // there are some new ones
  if (validTransmissions.length === 0) {
    await addJob([], 1000 * 10);
    return;
  }

  // Pick a random transmission
  const transmission = validTransmissions[Math.floor(Math.random() * validTransmissions.length)];

  // Pick a random stem
  const validStems = transmission.stems.filter((stem) => stem !== "source");
  const stem = validStems[Math.floor(Math.random() * validStems.length)];

  // Pick a random queue time
  const newDelay = 2000 + Math.floor(Math.random() * validStems.length) * 2000;

  // Queue up the next operation
  await addJob(
    [
      {
        index: validStems.indexOf(stem) as ChannelIndex,
        transmission: { id: transmission.id, stem },
      },
    ],
    newDelay,
  );
};
export default runJob;
