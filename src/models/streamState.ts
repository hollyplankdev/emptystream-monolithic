import mongoose, { ObjectId, Schema, model } from "mongoose";
import { ITimestamps } from "./timestamps.js";
import { ALL_TRANSMISSION_STEMS, TransmissionStem } from "./transmissionStem.js";

export interface IChannelTuning {
  /** The index of the channel that this tuning represents. */
  index: number;

  /** Details about the transmission that this channel is tuned to. */
  transmission: {
    /** The ID of the transmission that this channel is tuned to. */
    id: ObjectId;

    /** The stem of the transmission that this channel is tuned to. */
    stem: TransmissionStem;
  };

  /** When this tuning started. */
  startTime?: Date;

  /**
   * How long it should take to go from some previous tuning settings to the tuning settings
   * described in this object.
   */
  transitionDuration?: Date;
}

export interface IStreamState {
  /** The tunings for each channel on the stream. */
  tunings: [IChannelTuning];
}

export const ChannelTuningSchema = new Schema<IChannelTuning>(
  {
    index: { type: Number, required: true },
    transmission: {
      type: new Schema<IChannelTuning["transmission"]>(
        {
          id: { type: mongoose.Types.ObjectId, required: true },
          stem: { type: String, required: true, enum: ALL_TRANSMISSION_STEMS },
        },
        { _id: false },
      ),
      required: true,
    },
    startTime: { type: Date, required: false },
    transitionDuration: { type: Date, required: false },
  },
  { _id: false },
);

export const StreamStateSchema = new Schema<IStreamState>(
  {
    tunings: { type: [ChannelTuningSchema], required: true },
  },
  { timestamps: true },
);

export const StreamState = model<IStreamState & ITimestamps>("StreamState", StreamStateSchema);
