import { Queue, QueueEvents, Worker } from "bullmq";
import { spawn } from "child_process";
import crypto from "crypto";
import * as fs from "fs";
import * as fsPromise from "fs/promises";
import path from "path";
import { Readable } from "stream";
import { getRedisConnectionOptions } from "../config/redis.config.js";
import { getTransmissionStorageClient } from "../config/transmissionStorage.config.js";
import { ISplitOperation, Transmission } from "../models/transmission.js";

//
//  Interfaces
//

export interface ISplitAudioInput {
  /** The ID of the Transmission that we are splitting audio for. */
  transmissionId: string;

  /** The name of the Transmission that we are splitting audio for. */
  transmissionName: string;

  /**
   * The name of the audio track we are splitting. This is it's file name (including extension)
   * relative to `demucsInputPath`.
   */
  inputFileName: string;

  /** The full path to the audio track we are splitting. */
  inputFilePathFull: string;
}

//
//  Constants
//

/** The name of the queue that this file is describing. */
const queueName: string = "SplitAudio";

/** Where demucs expects audio files to be located when splitting, on the local filesystem. */
const demucsInputPath: string = path.join(process.cwd(), "docker-facebook-demucs", "input");

/** Where demucs spits out stems after splitting audio, on the local filesystem. */
const demucsOutputPath: string = path.join(
  process.cwd(),
  "docker-facebook-demucs",
  "output",
  "htdemucs",
);

//
//  Queue Jobs
//

/** The queue holding all audio splitting jobs. */
const queue = new Queue<ISplitAudioInput>(queueName, { connection: getRedisConnectionOptions() });

/**
 * Add an audio split operation to the queue.
 *
 * @param transmissionId The ID of the transmission to split.
 * @param transmissionName The name of the transmission that we're splitting.
 * @param inputAudio The stream containing the source audio.
 */
export function addToQueue(transmissionId: string, transmissionName: string, inputAudio: Readable) {
  // Generate a random file name to use
  const randomFileName = `${crypto.randomBytes(32).toString("hex")}.mp3`;

  // TODO - refactor this to NOT need input audio. We should be able to read the source from
  // transmission storage in the TASK ITSELF.
  // Store the input audio in the local filesystem
  const sourceFilePath = path.join(demucsInputPath, randomFileName);
  const sourceWriteStream = fs.createWriteStream(sourceFilePath);
  inputAudio.pipe(sourceWriteStream);

  // ...then tell our queue that we want to split this audio!
  return queue.add(`split_${transmissionName}`, {
    transmissionId,
    transmissionName,
    inputFileName: randomFileName,
    inputFilePathFull: sourceFilePath,
  });
}

//
//  Queue Work
//

export function createWorker() {
  return new Worker<ISplitAudioInput>(
    queueName,
    async (job) => {
      // Run demucs locally, and have it split the desired audio
      await job.updateProgress({ percentage: 10, status: "running_demucs" });
      await new Promise<void>((resolve, reject) => {
        // Start the demucs process for the given track
        const demucsProcess = spawn(
          "make",
          ["run", `track=${job.data.inputFileName}`, "mp3output=true"],
          {
            cwd: path.join(process.cwd(), "docker-facebook-demucs"),
          },
        );

        // Log stdout!
        demucsProcess.stdout.setEncoding("utf-8");
        demucsProcess.stdout.on("data", async (chunk) => {
          await job.log(chunk);
        });

        // Log stderr!
        demucsProcess.stderr.setEncoding("utf-8");
        demucsProcess.stderr.on("data", async (chunk) => {
          await job.log(chunk);
        });

        // Resolve the promise when the process is finished
        demucsProcess.on("close", (code) => {
          if (code !== 0) {
            reject(code);
          } else {
            resolve();
          }
        });
      });

      // Now that demucs is done, we can upload our stems!
      const transmissionStorage = getTransmissionStorageClient();
      const outputStemBasePath = path.join(
        demucsOutputPath,
        path.parse(job.data.inputFileName).name,
      );
      const stemTypes = ["drums", "bass", "vocals", "other"];

      // Pipe each stem into transmission storage
      await job.updateProgress({ percentage: 70, status: "uploading_stems" });
      await Promise.all(
        stemTypes.map(async (stemType) => {
          // Open a stream that allows reading from the local stem audio file.
          const localFileReadStream = fs.createReadStream(
            path.join(outputStemBasePath, `${stemType}.mp3`),
          );

          // Open a stream that allows writing to wherever the stem should be stored
          // in TransmissionStorage.
          const stemWriteStream = await transmissionStorage.createStemWriteStream(
            job.data.transmissionId,
            stemType,
          );

          // Pipe bytes from the stem to TransmissionStorage!
          localFileReadStream.pipe(stemWriteStream);
        }),
      );

      // Add the stem types to the DB object
      await Transmission.updateOne({ _id: job.data.transmissionId }, { stems: stemTypes });

      // Clean up created files, now that we don't need them.
      await job.updateProgress({ percentage: 90, status: "cleaning_up" });
      await fsPromise.rm(outputStemBasePath, { recursive: true, force: true });
      await fsPromise.rm(job.data.inputFilePathFull, { recursive: true, force: true });
    },
    {
      concurrency: 1,
      connection: getRedisConnectionOptions(),
    },
  );
}

//
//  Queue Events
//

/** The object allowing us to listen to events on the queue described by this file. */
const queueEvents = new QueueEvents(queueName, { connection: getRedisConnectionOptions() });

/** Called when a job is started. */
queueEvents.on("active", async (args) => {
  // Get info about this job
  const jobData = (await queue.getJob(args.jobId))?.data;
  if (!jobData) return;

  // Update the split operation field.
  await Transmission.updateOne(
    { _id: jobData.transmissionId },
    { splitOperation: { status: "started_job", percentage: 5 } },
  );
});

/** Called when a job reports it's progress */
queueEvents.on("progress", async (args) => {
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
});

/** Called when a job is completed correctly. */
queueEvents.on("completed", async (args) => {
  // Get info about this job
  const jobData = (await queue.getJob(args.jobId))?.data;
  if (!jobData) return;

  // Update the split operation field.
  await Transmission.updateOne(
    { _id: jobData.transmissionId },
    { splitOperation: { status: "complete", percentage: 100 } },
  );
});

/** Called when a job fails to complete. */
queueEvents.on("failed", async (args) => {
  // Get info about this job
  const jobData = (await queue.getJob(args.jobId))?.data;
  if (!jobData) return;

  // Update the split operation field.
  await Transmission.updateOne(
    { _id: jobData.transmissionId },
    { splitOperation: { status: "failed" } },
  );
});
