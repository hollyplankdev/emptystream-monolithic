/* eslint-disable @typescript-eslint/no-unused-vars */
import { RequestHandler } from "express";
import { IChannelTuning, StreamState } from "../models/streamState.js";
import { Transmission } from "../models/transmission.js";

const read: RequestHandler = async (req, res) => {
  // Grab or create the stream state.
  const state = await StreamState.findOrCreateSingleton();

  // Return information about the current stream state.
  res
    .status(200)
    .contentType("json")
    .send(JSON.stringify({ time: new Date(), tunings: state.tunings }));
};

const tune: RequestHandler = async (req, res) => {
  // Grab or create the stream state.
  const state = await StreamState.findOrCreateSingleton();

  try {
    // Retune the channels in the stream state
    await state.retune(req.body.tunings || []);
  } catch (e) {
    // If there's a problem, EXIT EARLY.
    res
      .status(404)
      .contentType("json")
      .send(JSON.stringify({ message: "Invalid tuning." }));
    return;
  }

  // OTHERWISE, we did it!
  res
    .status(200)
    .contentType("json")
    .send(JSON.stringify({ tunings: state.tunings }));
};

export default {
  read,
  tune,
};
