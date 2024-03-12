import { Processor } from "bullmq";
import { spawn } from "child_process";
import crypto from "crypto";
import { TransmissionStem } from "@emptystream/shared";
import * as fs from "fs";
import * as fsPromise from "fs/promises";
import path from "path";
import { getTransmissionStorageClient } from "../../config/transmissionStorage.config.js";
import { Transmission } from "../../models/transmission.js";
import TransmissionStorage from "../../utils/transmission_storage.js";
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

//
//  Private Functions
//

/**
 * Download the source audio file of a transmission to local disk, from transmission storage.
 *
 * @param destFilePath Where to store the file on disk. This must be the whole path, including file
 *   name and extension.
 * @param id The ID of the Transmission to download the source from.
 * @param storage The instance of TransmissionStorage to use when downloading audio.
 */
async function downloadTransmissionSource(
  destFilePath: string,
  id: string,
  storage: TransmissionStorage,
) {
  // Create a stream that allows us to read the transmission source audio from storage
  const sourceReadStream = await storage.createStemReadStream(id, "source");
  if (!sourceReadStream) throw new Error("Source stream not found");

  // Store the source audio in the local filesystem
  const sourceWriteStream = fs.createWriteStream(destFilePath);
  sourceReadStream.pipe(sourceWriteStream);
}

/**
 * Splits an audio file into stems by running demucs through docker.
 *
 * @param inputFileName The name of the audio file to split, including file extension. This file is
 *   assumed to be in demus' input folder.
 */
function splitWithDemucs(inputFileName: string) {
  return new Promise<void>((resolve, reject) => {
    // Start the demucs process for the given track
    const demucsProcess = spawn("make", ["run", `track=${inputFileName}`, "mp3output=true"], {
      cwd: path.join(process.cwd(), "docker-facebook-demucs"),
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
}

/**
 * Takes stems in a folder, uploads them to TransmissionStorage, and updates the Transmission in the
 * DB to reflect the new stems.
 *
 * @param stemBasePath The filepath to the directory containing the stems to upload.
 * @param id The ID of the Transmission to upload stems for.
 * @param storage The instance of TransmissionStorage that we should upload stems to.
 */
async function uploadTransmissionStems(
  stemBasePath: string,
  id: string,
  storage: TransmissionStorage,
) {
  const stemTypes: TransmissionStem[] = ["drums", "bass", "vocals", "other"];

  // Pipe each stem into transmission storage
  await Promise.all(
    stemTypes.map(async (stemType) => {
      // Open a stream that allows reading from the local stem audio file.
      const localFileReadStream = fs.createReadStream(path.join(stemBasePath, `${stemType}.mp3`));

      // Open a stream that allows writing to wherever the stem should be stored
      // in TransmissionStorage.
      const stemWriteStream = await storage.createStemWriteStream(id, stemType);

      // Pipe bytes from the stem to TransmissionStorage!
      localFileReadStream.pipe(stemWriteStream);
    }),
  );

  // Update the DB object for this transmission to display what stems it contains
  await Transmission.updateOne({ _id: id }, { stems: stemTypes });
}

//
//
//  Main Job Function
//
//

/**
 * Runs the audio splitting job. Meant to be called by a BullMQ worker.
 *
 * @param job
 */
const runJob: Processor<ISplitAudioInput> = async (job) => {
  const transmissionStorage = getTransmissionStorageClient();

  // Generate a random file name to use
  const inputFileName = `${crypto.randomBytes(32).toString("hex")}.mp3`;
  const inputFilePathFull = path.join(demucsInputPath, inputFileName);
  const outputStemBasePath = path.join(demucsOutputPath, path.parse(inputFileName).name);

  // 1. DOWNLOAD TRANSMISSION SOURCE
  await job.updateProgress({ percentage: 10, status: "downloading_source" });
  await downloadTransmissionSource(inputFilePathFull, job.data.transmissionId, transmissionStorage);

  // 2. SPLIT AUDIO WITH DEMUCS
  await job.updateProgress({ percentage: 20, status: "running_demucs" });
  await splitWithDemucs(inputFileName);

  // 3. UPLOAD SPLIT STEMS
  await job.updateProgress({ percentage: 70, status: "uploading_stems" });
  await uploadTransmissionStems(outputStemBasePath, job.data.transmissionId, transmissionStorage);

  // 4. CLEAN UP TEMP FILES
  await job.updateProgress({ percentage: 90, status: "cleaning_up" });
  await fsPromise.rm(outputStemBasePath, { recursive: true, force: true });
  await fsPromise.rm(inputFilePathFull, { recursive: true, force: true });
};
export default runJob;
