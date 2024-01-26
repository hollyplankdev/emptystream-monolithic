import { Request } from "express";
import * as fs from "fs";
import { Readable } from "stream";
import getFileFromRequest from "./get_file_from_request.js";

export default function getFileReadStreamFromRequest(req: Request, fieldName: string): Readable {
  const file = getFileFromRequest(req, fieldName);

  // If multer is directly exposing stream, USE THAT
  if (file.stream) return file.stream;

  // If multer is storing our file in memory, use the buffer to create a readable stream.
  if (file.buffer) return Readable.from(file.buffer);

  // If multer is storing our file on disk, use the filesystem to create a readable stream.
  if (file.path) return fs.createReadStream(file.path);

  // OTHERWISE, we have NO IDEA how to handle this
  throw new Error("Unable to create file read stream");
}
