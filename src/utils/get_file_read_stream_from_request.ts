import { Request } from "express";
import * as fs from "fs";
import { Readable } from "stream";
import getFileFromRequest from "./get_file_from_request.js";

/**
 * Gets the Readable stream of a desired file stored as multipart/form-data in a given Express
 * request. Throws if it can't find the file, or if it can't figure out how to get the stream.
 *
 * @param req The Express request that contains the file we want a stream for.
 * @param fieldName The field that contains the file in the given request's multipart/form-data.
 * @returns A Readable stream pointing to the file in the request. Depending on how Multer stores
 *   files, this may stream from memory or may stream from the disk.
 */
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
