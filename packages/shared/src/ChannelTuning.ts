import { ChannelIndex } from "./ChannelIndex.js";
import { TransmissionStem } from "./TransmissionStem.js";

export interface ChannelTuning {
  /** The index of the channel that this tuning represents. */
  index: ChannelIndex;

  /** Details about the transmission that this channel is tuned to. */
  transmission: {
    /** The ID of the transmission that this channel is tuned to. */
    id: string;

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
