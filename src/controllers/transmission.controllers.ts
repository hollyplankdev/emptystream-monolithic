/* eslint-disable @typescript-eslint/no-unused-vars */
import { RequestHandler } from "express";
import { Transmission } from "../models/transmission.js";

const create: RequestHandler = (req, res) => {
  throw new Error("Not implemented!");
};

const read: RequestHandler = async (req, res) => {
  const transmission = await Transmission.findById(req.params.id);
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
