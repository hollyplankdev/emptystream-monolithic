/* eslint-disable @typescript-eslint/no-unused-vars */
import { RequestHandler } from "express";
import { StreamState } from "../models/streamState.js";

const read: RequestHandler = async (req, res) => {
  const currentState = await StreamState.findOrCreateSingleton();

  // Return information about the current stream state.
  res
    .status(200)
    .contentType("json")
    .send(JSON.stringify({ time: new Date(), tunings: currentState.tunings }));
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
