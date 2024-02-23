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

  // Before doing anything, validate the given tunings.
  const newTunings: IChannelTuning[] = req.body.tunings || [];
  try {
    await Promise.all(
      newTunings.map(async (tuning) => {
        // Try to find the transmission that we're tuning to.
        const transmission = await Transmission.findById(tuning.transmission.id);
        // If there's no transmission with this ID, THROW
        if (!transmission) throw new Error("404");
        // If this stem isn't in this transmission, THROW
        if (!(tuning.transmission.stem in transmission.stems)) throw new Error("404");
      }),
    );
  } catch (e) {
    // If there's a problem, EXIT EARLY.
    res
      .status(404)
      .contentType("json")
      .send(JSON.stringify({ message: "Invalid tuning." }));
    return;
  }

  // Store the current time. We do this ahead of time so that the value stays the same
  const currentTime = new Date();

  // For each tuning provided, update / add channel tunings as necessary
  newTunings.forEach((tuning) => {
    // Find out where in the state's tuning array is the channel that we're tuning.
    const indexInArray = state.tunings.findIndex((oldTuning) => oldTuning.index === tuning.index);

    // If this channel doesn't have a tuning yet, add it!
    if (indexInArray === -1) {
      state.tunings.push({ ...tuning, startTime: currentTime });
    } else {
      // If this channel DOES have a tuning, update it!
      const oldTuning = state.tunings[indexInArray];
      state.tunings[indexInArray] = { ...oldTuning, ...tuning, startTime: currentTime };
    }
  });

  // Save the stream state!
  await state.save();

  res
    .status(200)
    .contentType("json")
    .send(JSON.stringify({ tunings: state.tunings }));
};

export default {
  read,
  tune,
};
