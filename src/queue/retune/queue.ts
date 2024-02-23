import { Queue, QueueEvents, Worker } from "bullmq";
import { getRedisConnectionOptions } from "../../config/redis.config.js";
import { IRetuneInput } from "./interfaces.js";
import runJob from "./runJob.js";
import onActive from "./events/onActive.js";
import onCompleted from "./events/onCompleted.js";
import onFailed from "./events/onFailed.js";
import onProgress from "./events/onProgress.js";

/** The name of the queue that this file is describing. */
export const queueName: string = "Retune";

/** The queue holding all retune jobs. */
export const queue = new Queue<IRetuneInput>(queueName, {
  connection: getRedisConnectionOptions(),
});

/** The object allowing us to listen to events on the queue described by this file. */
export const queueEvents = new QueueEvents(queueName, { connection: getRedisConnectionOptions() });
queueEvents.on("active", onActive);
queueEvents.on("completed", onCompleted);
queueEvents.on("failed", onFailed);
queueEvents.on("progress", onProgress);

/** @returns A new BullMQ worker that runs this job */
export function createWorker() {
  return new Worker<IRetuneInput>(queueName, runJob, {
    concurrency: 1,
    connection: getRedisConnectionOptions(),
  });
}
