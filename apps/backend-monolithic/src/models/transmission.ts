import {
  ALL_TRANSMISSION_STEMS,
  ISplitOperation,
  ITimestamps,
  ITransmission,
} from "@emptystream/shared";
import { Schema, model } from "mongoose";

export const SplitOperationSchema = new Schema<ISplitOperation>(
  {
    status: { type: String, required: true },
    percentage: { type: Number, required: true },
  },
  { _id: false },
);

export const TransmissionSchema = new Schema<ITransmission>(
  {
    name: { type: String, required: true },
    stems: { type: [String], required: true, enum: ALL_TRANSMISSION_STEMS },
    splitOperation: { type: SplitOperationSchema, required: true },
  },
  { timestamps: true },
);

export const Transmission = model<ITransmission & ITimestamps>("Transmission", TransmissionSchema);
