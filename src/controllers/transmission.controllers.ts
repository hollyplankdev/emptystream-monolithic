/* eslint-disable @typescript-eslint/no-unused-vars */
import { RequestHandler } from "express";
import { Transmission } from "../models/transmission.js";

const create: RequestHandler = async (req, res) => {
  // Text multipart fields available at `req.body`
  // File multipart fields available at `req.files`

  // TODO - actually save the audio file.
  const transmission = new Transmission({ name: req.body.name });
  await transmission.save();

  res.status(200).contentType("json").send(JSON.stringify(transmission));
};

const read: RequestHandler = async (req, res) => {
  const transmission = await Transmission.findById(req.params.id);

  // If there's no transmission... EXIT EARLY.
  if (!transmission) {
    res.status(400).json({ message: `${req.params.id} not found.` });
    return;
  }

  res.status(200).json({
    message: "OK",
    transmission,
  });
};

const update: RequestHandler = (req, res) => {
  throw new Error("Not implemented!");
};

const remove: RequestHandler = (req, res) => {
  throw new Error("Not implemented!");
};

const list: RequestHandler = (req, res) => {
  throw new Error("Not implemented!");
};

export default {
  create,
  read,
  update,
  remove,
  list,
};
