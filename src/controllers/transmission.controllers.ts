/* eslint-disable @typescript-eslint/no-unused-vars */
import { RequestHandler } from "express";
import { Transmission } from "../models/transmission.js";

const create: RequestHandler = (req, res) => {
  console.log(req.body);
  console.log(req.files);

  throw new Error("Not implemented!");
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
