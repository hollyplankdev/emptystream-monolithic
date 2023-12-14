import { Schema, model } from "mongoose";

export interface ITransmission {
  /** The ID of this transmission. */
  id: String;

  /** The name describing this transmission. */
  name: String;
}

export const TransmissionSchema = new Schema<ITransmission>({
  id: { type: String, required: true },
  name: { type: String, required: true },
});

export const Transmission = model<ITransmission>("Transmission", TransmissionSchema);
