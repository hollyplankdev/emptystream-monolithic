import { IChannelTuning } from "../../models/streamState.js";

export interface IRetuneInput {
  /** The new channel tunings to apply to the stream state. */
  tunings: IChannelTuning[];
}
