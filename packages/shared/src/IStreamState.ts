import { ChannelTuning } from "./ChannelTuning";

/** A singleton in the database that describes the global state of `emptystream`. */
export interface IStreamState {
  /** The explicit ID of this singleton. Should always be 0. */
  _id: number;

  /** The tunings for each channel on the stream. */
  tunings: ChannelTuning[];
}
