import { QueueEventsListener } from "bullmq";
import { queue } from "../queue.js";

/** Called when a job is completed. */
const onCompleted: QueueEventsListener["completed"] = async (args) => {
  // Get info about this job
  const job = await queue.getJob(args.jobId);
  if (!job) return;

  console.log(`Retune job completed ${job.name}`);
};
export default onCompleted;
