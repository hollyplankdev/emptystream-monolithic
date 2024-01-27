import { spawn } from "child_process";
import { Readable } from "stream";
import crypto from "crypto";
import path from "path";
import * as fsPromise from "fs/promises";
import * as fs from "fs";

function generateKeyName(): string {
  return crypto.randomBytes(32).toString("hex");
}

function runDemucs(trackName: string) {
  return new Promise<void>((resolve, reject) => {
    // Start the demucs process for the given track
    const demucsProcess = spawn("make", ["run", `track=${trackName}`, "mp3output=true"], {
      cwd: path.join(process.cwd(), "docker-facebook-demucs"),
    });

    // Log stdout!
    demucsProcess.stdout.setEncoding("utf-8");
    demucsProcess.stdout.on("data", (chunk) => {
      console.log(chunk);
    });

    // Log stderr!
    demucsProcess.stderr.setEncoding("utf-8");
    demucsProcess.stderr.on("data", (chunk) => {
      console.log(chunk);
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

export default async function splitAudio(inputAudio: Readable) {
  // Pipe the audio to a temporary file in demucs' input dir
  const keyName = generateKeyName();
  const sourceFilePath = path.join(
    process.cwd(),
    "docker-facebook-demucs",
    "input",
    `${keyName}.mp3`,
  );
  const sourceWriteStream = fs.createWriteStream(sourceFilePath);
  inputAudio.pipe(sourceWriteStream);

  // Execute Demucs on the temporary source audio
  await runDemucs(`${keyName}.mp3`);

  // Create read streams form each stem
  const stemBasePath = path.join(
    process.cwd(),
    "docker-facebook-demucs",
    "output",
    "htdemucs",
    keyName,
  );
  const drumsReadStream = fs.createReadStream(path.join(stemBasePath, "drums.mp3"));
  const bassReadStream = fs.createReadStream(path.join(stemBasePath, "bass.mp3"));
  const vocalsReadStream = fs.createReadStream(path.join(stemBasePath, "vocals.mp3"));
  const otherReadStream = fs.createReadStream(path.join(stemBasePath, "other.mp3"));

  // Create a function that will cleanup all temporary files
  const cleanupFunc = async () => {
    await fsPromise.rm(stemBasePath, { recursive: true, force: true });
    await fsPromise.rm(sourceFilePath, { recursive: true, force: true });
  };

  // Return read streams and cleanup function
  return {
    drumsReadStream,
    bassReadStream,
    vocalsReadStream,
    otherReadStream,
    cleanupFunc,
  };
}
