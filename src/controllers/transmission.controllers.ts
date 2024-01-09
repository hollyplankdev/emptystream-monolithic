/* eslint-disable @typescript-eslint/no-unused-vars */
import { RequestHandler } from "express";
import { FilterQuery } from "mongoose";
import { ITransmission, Transmission } from "../models/transmission.js";

const create: RequestHandler = async (req, res) => {
  // Text multipart fields available at `req.body`
  // File multipart fields available at `req.files`

  // TODO - actually save the audio file.
  const transmission = new Transmission({ name: req.body.name });
  await transmission.save();

  res.status(200).contentType("json").send(JSON.stringify(transmission));
};

const read: RequestHandler = async (req, res) => {
  const transmission = await Transmission.findById(req.params.id).lean();

  // If there's no transmission... EXIT EARLY.
  if (!transmission) {
    res.status(400).json({ message: `${req.params.id} not found.` });
    return;
  }

  // Send the transmission!
  res.status(200).contentType("json").send(JSON.stringify(transmission));
};

const update: RequestHandler = async (req, res) => {
  const transmission = await Transmission.findById(req.params.id);

  // If there's no transmission... EXIT EARLY.
  if (!transmission) {
    res.status(400).json({ message: `${req.params.id} not found.` });
    return;
  }

  // Update the transmission
  if (req.body.name) transmission.name = req.body.name;
  await transmission.save();

  // Send the transmission!
  res.status(200).contentType("json").send(JSON.stringify(transmission));
};

const remove: RequestHandler = async (req, res) => {
  const transmission = await Transmission.findByIdAndDelete(req.params.id);

  console.log(JSON.stringify(transmission));

  // TODO - actually remove audio related to transmission

  if (!transmission) {
    res.status(404).json({ message: `${req.params.id} not found.` });
    return;
  }

  res.status(200).send();
};

const list: RequestHandler = async (req, res) => {
  // Following the example at https://stackoverflow.com/a/23640287
  const pageSize: number = parseInt(req.params.pageSize, 10);

  // If we're trying to paginate results, use our page
  // key to skip through results from MongoDB. Otherwise
  // just use an empty query to get the first `pageSize`
  // documents.
  const searchQuery: FilterQuery<ITransmission> = {};
  if (req.params.lastPageKey) {
    searchQuery.createdOn = { $lte: req.params.lastPageKey };
  }

  const foundItems = await Transmission.find(searchQuery).limit(pageSize).sort("-createdOn").lean();

  //
  // const pageKey = foundItems.length > 0 ? foundItems[foundItems.length - 1].createdAt : undefined;
  const response = {
    items: foundItems,
  };

  console.log(JSON.stringify(foundItems));
  res.status(200).contentType("json").send(JSON.stringify(response));
  // throw new Error("Not implemented!");
};

export default {
  create,
  read,
  update,
  remove,
  list,
};
