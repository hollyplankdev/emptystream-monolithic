import { Schema, model } from "mongoose";

export interface ITransmission {
  /** The name describing this transmission. */
  name: String;
}

export interface ITimestamps {
  createdAt?: Date;
  updatedAt?: Date;
}

export const TransmissionSchema = new Schema<ITransmission>(
  {
    name: { type: String, required: true },
  },
  { timestamps: true },
);

export const Transmission = model<ITransmission & ITimestamps>("Transmission", TransmissionSchema);
