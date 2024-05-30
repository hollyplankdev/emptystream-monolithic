import { ISplitOperation } from "./ISplitOperation";
import { TransmissionStem } from "./TransmissionStem";

/** Information about some audio transmission that can be played on `emptystream`. */
export interface ITransmission {
  /** The name describing this transmission. */
  name: string;

  /** The stem types that this transmission has. */
  stems: TransmissionStem[];

  /** Information about the audio splitting operation for this Transmission. */
  splitOperation: ISplitOperation;
}
