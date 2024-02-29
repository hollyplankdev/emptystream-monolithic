import addJob from "./addJob.js";
import { queue } from "./queue.js";

export default async function kickstart() {
  // If the retune queue is already active, let it be.
  const counts = await queue.getJobCountByTypes("waiting", "delayed");
  if (counts > 0) return;

  // If there's nothing in the retune queue, kickstart it!
  await addJob([], 0);
}
