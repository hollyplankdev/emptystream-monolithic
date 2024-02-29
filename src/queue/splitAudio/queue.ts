import { Queue, QueueEvents, Worker } from "bullmq";
import { getIoRedisConnectionOptions } from "../../config/redis.config.js";
import { ISplitAudioInput } from "./interfaces.js";
import runJob from "./runJob.js";
import onActive from "./events/onActive.js";
import onCompleted from "./events/onCompleted.js";
import onFailed from "./events/onFailed.js";
import onProgress from "./events/onProgress.js";

/** The name of the queue that this file is describing. */
export const queueName: string = "SplitAudio";

/** The queue holding all audio splitting jobs. */
export const queue = new Queue<ISplitAudioInput>(queueName, {
  connection: getIoRedisConnectionOptions(),
});

/** The object allowing us to listen to events on the queue described by this file. */
export const queueEvents = new QueueEvents(queueName, {
  connection: getIoRedisConnectionOptions(),
});
queueEvents.on("active", onActive);
queueEvents.on("completed", onCompleted);
queueEvents.on("failed", onFailed);
queueEvents.on("progress", onProgress);

/** @returns A new BullMQ worker that runs this job */
export function createWorker() {
  return new Worker<ISplitAudioInput>(queueName, runJob, {
    concurrency: 1,
    connection: getIoRedisConnectionOptions(),
  });
}
