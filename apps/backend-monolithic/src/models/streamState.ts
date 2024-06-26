import {
  ALL_CHANNEL_INDEX,
  ALL_TRANSMISSION_STEMS,
  ChannelTuning,
  IStreamState,
  ITimestamps,
} from "@emptystream/shared";
import { HydratedDocument, Model, Schema, model } from "mongoose";
import { createClient as createRedisClient } from "redis";
import { getRedisConnectionOptions } from "../config/redis.config.js";
import { Transmission } from "./transmission.js";

export interface IStreamStateModel extends Model<IStreamState> {
  /** Returns the singleton stream state object from the DB. Creates one if it doesn't exist yet. */
  findOrCreateSingleton(): Promise<HydratedDocument<IStreamState, IStreamStateMethods>>;
}

export interface IStreamStateMethods {
  /** Retunes the channels in the state. */
  retune(tunings: ChannelTuning[]): Promise<HydratedDocument<IStreamState, IStreamStateMethods>>;
}

export const ChannelTuningSchema = new Schema<ChannelTuning>(
  {
    index: { type: Number, required: true, enum: ALL_CHANNEL_INDEX },
    transmission: {
      type: new Schema<ChannelTuning["transmission"]>(
        {
          id: { type: String, required: true },
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

export const StreamStateSchema = new Schema<IStreamState, IStreamStateModel, IStreamStateMethods>(
  {
    _id: { type: Number, enum: [0] },
    tunings: { type: [ChannelTuningSchema], required: true },
  },
  {
    _id: false,
    timestamps: true,
    statics: {
      /** Implements findOrCreateSingleton from IStreamStateModel. */
      async findOrCreateSingleton() {
        // Try to grab the singleton. If it exists, return it.
        const foundDoc = await this.findById(0);
        if (foundDoc) return foundDoc;

        // OTHERWISE - the singleton doesn't exist yet. Create it!
        const createdDoc = await this.create({ _id: 0, tunings: [] });
        return createdDoc;
      },
    },
    methods: {
      /** Implements retune from IStreamStateMethods. */
      async retune(tunings: ChannelTuning[]) {
        // Before doing anything, validate the given tunings.
        await Promise.all(
          tunings.map(async (tuning) => {
            const transmission = await Transmission.findById(tuning.transmission.id);
            if (!transmission || !transmission.stems.includes(tuning.transmission.stem)) {
              throw new Error(`Could not find transmission ${JSON.stringify(tuning.transmission)}`);
            }
          }),
        );

        // Store the current time. We do this ahead of time so that the value stays the same
        const currentTime = new Date();

        // For each tuning provided, update / add channel tunings as necessary
        tunings.forEach((tuning) => {
          // Find out where in the state's tuning array is the channel that we're tuning.
          const indexInArray = this.tunings.findIndex(
            (oldTuning) => oldTuning.index === tuning.index,
          );

          // If this channel doesn't have a tuning yet, add it!
          if (indexInArray === -1) {
            this.tunings.push({ ...tuning, startTime: currentTime });
          } else {
            // If this channel DOES have a tuning, update it!
            const oldTuning = this.tunings[indexInArray];
            this.tunings[indexInArray] = { ...oldTuning, ...tuning, startTime: currentTime };
          }
        });

        // Save the stream state!
        this.save();

        // Publish this change
        // TODO - (how can we do better?)
        const redisClient = createRedisClient(getRedisConnectionOptions());
        await redisClient.connect();
        await redisClient.publish("tuningsUpdated", JSON.stringify(tunings));
        await redisClient.disconnect();

        return this;
      },
    },
  },
);

export const StreamState = model<IStreamState & ITimestamps, IStreamStateModel>(
  "StreamState",
  StreamStateSchema,
);
