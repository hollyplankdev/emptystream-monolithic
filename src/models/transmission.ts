import { Schema, model } from "mongoose";

export interface ISplitOperation {
  /** The current status of the operation. */
  status: String;

  /** How complete the operation is, from 0-100. */
  percentage: number;
}

export interface ITimestamps {
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ITransmission {
  /** The name describing this transmission. */
  name: String;

  /** The stem types that this transmission has. */
  stems: [String];

  /** Information about the audio splitting operation for this Transmission. */
  splitOperation: ISplitOperation;
}

export const SplitOperationSchema = new Schema<ISplitOperation>({
  status: { type: String, required: true },
  percentage: { type: Number, required: true },
});

export const TransmissionSchema = new Schema<ITransmission>(
  {
    name: { type: String, required: true },
    stems: { type: [String], required: true },
    splitOperation: { type: SplitOperationSchema, required: true },
  },
  { timestamps: true },
);

export const Transmission = model<ITransmission & ITimestamps>("Transmission", TransmissionSchema);
