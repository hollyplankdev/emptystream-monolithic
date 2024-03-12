import { QueueEventsListener } from "bullmq";
import { queue } from "../queue.js";

/** Called when a job reports an update to it's progress. */
const onProgress: QueueEventsListener["progress"] = async (args) => {
  // Get info about this job
  const job = await queue.getJob(args.jobId);
  if (!job) return;

  console.log(`Retune job progress ${job.name} - ${JSON.stringify(args.data)}`);
};
export default onProgress;
