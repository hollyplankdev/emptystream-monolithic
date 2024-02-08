import { Processor } from "bullmq";
import { spawn } from "child_process";
import crypto from "crypto";
import * as fs from "fs";
import * as fsPromise from "fs/promises";
import path from "path";
import { getTransmissionStorageClient } from "../../config/transmissionStorage.config.js";
import { Transmission } from "../../models/transmission.js";
import { ISplitAudioInput } from "./interfaces.js";

/** Where demucs expects audio files to be located when splitting, on the local filesystem. */
const demucsInputPath: string = path.join(process.cwd(), "docker-facebook-demucs", "input");

/** Where demucs spits out stems after splitting audio, on the local filesystem. */
const demucsOutputPath: string = path.join(
  process.cwd(),
  "docker-facebook-demucs",
  "output",
  "htdemucs",
);

/**
 * Runs the audio splitting job. Meant to be called by a BullMQ worker.
 *
 * @param job
 */
const runJob: Processor<ISplitAudioInput> = async (job) => {
  //
  //  1. DOWNLOAD TRANSMISSION SOURCE
  //

  await job.updateProgress({ percentage: 10, status: "downloading_source" });
  const transmissionStorage = getTransmissionStorageClient();

  // Generate a random file name to use
  const inputFileName = `${crypto.randomBytes(32).toString("hex")}.mp3`;

  // Create a stream that allows us to read the transmission source audio from storage
  const sourceReadStream = await transmissionStorage.createStemReadStream(
    job.data.transmissionId,
    "source",
  );
  if (!sourceReadStream) throw new Error("Source stream not found");

  // Store the source audio in the local filesystem
  const inputFilePathFull = path.join(demucsInputPath, inputFileName);
  const sourceWriteStream = fs.createWriteStream(inputFilePathFull);
  sourceReadStream.pipe(sourceWriteStream);

  //
  //  2. SPLIT AUDIO WITH DEMUCS
  //

  // Run demucs locally, and have it split the desired audio
  await job.updateProgress({ percentage: 20, status: "running_demucs" });
  await new Promise<void>((resolve, reject) => {
    // Start the demucs process for the given track
    const demucsProcess = spawn("make", ["run", `track=${inputFileName}`, "mp3output=true"], {
      cwd: path.join(process.cwd(), "docker-facebook-demucs"),
    });

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

  //
  //  3. UPLOAD SPLIT STEMS
  //

  // Now that demucs is done, we can upload our stems!
  const outputStemBasePath = path.join(demucsOutputPath, path.parse(inputFileName).name);
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

  //
  //  4. CLEAN UP TEMP FILES
  //

  // Clean up created files, now that we don't need them.
  await job.updateProgress({ percentage: 90, status: "cleaning_up" });
  await fsPromise.rm(outputStemBasePath, { recursive: true, force: true });
  await fsPromise.rm(inputFilePathFull, { recursive: true, force: true });
};
export default runJob;
