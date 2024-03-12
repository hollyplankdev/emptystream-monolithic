import { ChannelTuning } from "@emptystream/shared";

export interface IRetuneInput {
  /** The new channel tunings to apply to the stream state. */
  tunings: ChannelTuning[];
}
