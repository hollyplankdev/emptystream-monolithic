import { QueueEventsListener } from "bullmq";
import { Transmission } from "../../../models/transmission.js";
import { queue } from "../queue.js";

/** Called when a job has failed. */
const onFailed: QueueEventsListener["failed"] = async (args) => {
  // Get info about this job
  const jobData = (await queue.getJob(args.jobId))?.data;
  if (!jobData) return;

  // Update the split operation field.
  await Transmission.updateOne(
    { _id: jobData.transmissionId },
    { splitOperation: { status: "failed" } },
  );
};
export default onFailed;
