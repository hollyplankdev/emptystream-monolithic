import { QueueEventsListener } from "bullmq";
import { Transmission } from "../../../models/transmission.js";
import { queue } from "../queue.js";

/** Called when a job is started. */
const onActive: QueueEventsListener["active"] = async (args) => {
  // Get info about this job
  const jobData = (await queue.getJob(args.jobId))?.data;
  if (!jobData) return;

  // Update the split operation field.
  await Transmission.updateOne(
    { _id: jobData.transmissionId },
    { splitOperation: { status: "started_job", percentage: 5 } },
  );
};
export default onActive;
