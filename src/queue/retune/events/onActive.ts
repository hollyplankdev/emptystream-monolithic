import { QueueEventsListener } from "bullmq";
import { queue } from "../queue.js";

/** Called when a job is started. */
const onActive: QueueEventsListener["active"] = async (args) => {
  // Get info about this job
  const job = await queue.getJob(args.jobId);
  if (!job) return;

  console.log(`Retune job started ${job.name}`);
};
export default onActive;
