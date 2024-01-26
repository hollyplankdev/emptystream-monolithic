import { Request } from "express";

export default function getFileFromRequest(req: Request, fieldName: string): Express.Multer.File {
  if (!req.files) throw new Error("No files provided");

  // If the files object is an array...
  if (req.files instanceof Array) {
    // ... try to find the desired file by it's field name using array.find
    const file = req.files.find((value) => value.fieldname === fieldName);
    if (!file) throw new Error(`No file with fieldName ${fieldName} found in files array`);
    return file;
  }

  // OTHERWISE, files is a dict
  if (!(fieldName in req.files)) {
    throw new Error(`No file with fieldName ${fieldName} found in files dict`);
  }
  return req.files[fieldName][0];
}
