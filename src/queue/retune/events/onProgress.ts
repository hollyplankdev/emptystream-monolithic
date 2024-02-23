import { QueueEventsListener } from "bullmq";
import { ISplitOperation, Transmission } from "../../../models/transmission.js";
import { queue } from "../queue.js";

/** Called when a job reports an update to it's progress. */
const onProgress: QueueEventsListener["progress"] = async (args) => {
  // Get info about this job
  const job = await queue.getJob(args.jobId);
  if (!job) return;

  console.log(`Retune job progress ${job.name} - ${args.data}`);
};
export default onProgress;
