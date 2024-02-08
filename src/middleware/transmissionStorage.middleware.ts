import { RequestHandler } from "express";
import { getTransmissionStorageClient } from "../config/transmissionStorage.config.js";

/** @returns Middleware that constructs TransmissionStorage and populates it's value in Request. */
export default function create(): RequestHandler {
  const handler: RequestHandler = (req, _res, next) => {
    req.transmissionStorage = getTransmissionStorageClient();
    next();
  };
  return handler;
}
