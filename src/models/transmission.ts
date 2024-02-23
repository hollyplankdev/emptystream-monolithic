import { Schema, model } from "mongoose";
import { ITimestamps } from "./timestamps.js";

export interface ISplitOperation {
  /** The current status of the operation. */
  status: string;

  /** How complete the operation is, from 0-100. */
  percentage: number;
}

export interface ITransmission {
  /** The name describing this transmission. */
  name: string;

  /** The stem types that this transmission has. */
  stems: [string];

  /** Information about the audio splitting operation for this Transmission. */
  splitOperation: ISplitOperation;
}

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
    stems: { type: [String], required: true },
    splitOperation: { type: SplitOperationSchema, required: true },
  },
  { timestamps: true },
);

export const Transmission = model<ITransmission & ITimestamps>("Transmission", TransmissionSchema);
