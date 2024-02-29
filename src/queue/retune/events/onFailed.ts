import { QueueEventsListener } from "bullmq";
import { queue } from "../queue.js";
import kickstart from "../kickstart.js";

/** Called when a job has failed. */
const onFailed: QueueEventsListener["failed"] = async (args) => {
  // Get info about this job
  const job = await queue.getJob(args.jobId);
  if (!job) return;

  console.log(`Retune job failed ${job.name}: ${args.failedReason}`);

  // After a job fails, make sure the queue keeps going by kickstarting it
  await kickstart();
};
export default onFailed;
