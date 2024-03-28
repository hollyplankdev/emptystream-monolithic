import { ChannelTuning } from "./ChannelTuning";

export interface IStreamState {
  /** The explicit ID of this singleton. Should always be 0. */
  _id: number;

  /** The tunings for each channel on the stream. */
  tunings: ChannelTuning[];
}
