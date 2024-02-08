import { QueueEventsListener } from "bullmq";
import { Transmission } from "../../../models/transmission.js";
import { queue } from "../queue.js";

/** Called when a job is completed. */
const onCompleted: QueueEventsListener["completed"] = async (args) => {
  // Get info about this job
  const jobData = (await queue.getJob(args.jobId))?.data;
  if (!jobData) return;

  // Update the split operation field.
  await Transmission.updateOne(
    { _id: jobData.transmissionId },
    { splitOperation: { status: "complete", percentage: 100 } },
  );
};
export default onCompleted;
