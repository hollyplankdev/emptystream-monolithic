import { RequestHandler } from "express";
import TransmissionStorage from "../utils/transmission_storage.js";
import LocalDiskStorageProvider from "../utils/local_disk_storage_provider.js";

/** @returns Middleware that constructs TransmissionStorage and populates it's value in Request. */
export default function create(): RequestHandler {
  const handler: RequestHandler = (req, _res, next) => {
    const provider = new LocalDiskStorageProvider();
    const storage = new TransmissionStorage(provider);

    req.transmissionStorage = storage;
    next();
  };
  return handler;
}
