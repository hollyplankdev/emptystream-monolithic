import { Processor } from "bullmq";
import { IRetuneInput } from "./interfaces.js";
import { StreamState } from "../../models/streamState.js";
import { Transmission } from "../../models/transmission.js";
import addJob from "./addJob.js";
import { ChannelIndex } from "../../models/channelIndex.js";

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
    splitOperation: { status: "complete", percentage: 100 },
  });
  await job.updateProgress({ percentage: 80, status: "loaded_transmissions" });
  console.log(`Found ${validTransmissions.length} transmissions`);

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
