/* eslint-disable @typescript-eslint/no-unused-vars */
import { RequestHandler } from "express";
import { FilterQuery } from "mongoose";
import { ITransmission, Transmission } from "../models/transmission.js";
import getFileReadStreamFromRequest from "../utils/get_file_read_stream_from_request.js";
import splitAudioQueue from "../queue/splitAudio.queue.js";

const read: RequestHandler = async (req, res) => {
  res
    .status(500)
    .contentType("json")
    .send(JSON.stringify({ message: "Not implemented yet!" }));
};

const tune: RequestHandler = async (req, res) => {
  res
    .status(500)
    .contentType("json")
    .send(JSON.stringify({ message: "Not implemented yet!" }));
};

export default {
  read,
  tune,
};
