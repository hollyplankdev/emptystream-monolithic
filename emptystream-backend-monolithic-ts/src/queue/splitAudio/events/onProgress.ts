import { QueueEventsListener } from "bullmq";
import { ISplitOperation, Transmission } from "../../../models/transmission.js";
import { queue } from "../queue.js";

/** Called when a job reports an update to it's progress. */
const onProgress: QueueEventsListener["progress"] = async (args) => {
  // Get info about this job
  const jobData = (await queue.getJob(args.jobId))?.data;
  if (!jobData) {
    return;
  }

  // Transform the given progress from args into the appropriate update data for the DB.
  // (We have to do this because args.data might be a number OR an object)
  let splitOperationUpdate;
  if (typeof args.data === "number") {
    splitOperationUpdate = { percentage: args.data };
  } else {
    const properlyTypedData: ISplitOperation = args.data as ISplitOperation;
    splitOperationUpdate = properlyTypedData;
  }

  // Update the split operation field.
  await Transmission.updateOne(
    { _id: jobData.transmissionId },
    { splitOperation: splitOperationUpdate },
  );
};
export default onProgress;
