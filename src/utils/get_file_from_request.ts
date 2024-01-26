import { Request } from "express";

/**
 * Get the multer file from an Express request given it's multipart/form-data field name. Throws if
 * the file is not in the request.
 *
 * @param req The Express Request that contains the file that we want to get.
 * @param fieldName The field that contains the file in the given request's multipart/form-data.
 * @returns The desired file.
 */
export default function getFileFromRequest(req: Request, fieldName: string): Express.Multer.File {
  // If multer parsed no files, EXIT EARLY
  if (!req.files) throw new Error("No files provided");

  // If the files object is an array...
  if (req.files instanceof Array) {
    // ... try to find the desired file by it's field name using array.find
    const file = req.files.find((value) => value.fieldname === fieldName);
    if (!file) throw new Error(`No file with fieldName ${fieldName} found in files array`);
    return file;
  }

  // OTHERWISE, files is a dict, so handle appropriately
  if (!(fieldName in req.files)) {
    throw new Error(`No file with fieldName ${fieldName} found in files dict`);
  }

  // Just default to returning the first file (for now)
  return req.files[fieldName][0];
}
