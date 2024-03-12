import { ChannelTuning } from "emptystream-shared-ts";

export interface IRetuneInput {
  /** The new channel tunings to apply to the stream state. */
  tunings: ChannelTuning[];
}
