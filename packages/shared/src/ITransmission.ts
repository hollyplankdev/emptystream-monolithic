import { DbObject } from "./DbObject";
import { ISplitOperation } from "./ISplitOperation";
import { TransmissionStem } from "./TransmissionStem";

/** A Transmission. */
export interface ITransmission {
  /** The name describing this transmission. */
  name: string;

  /** The stem types that this transmission has. */
  stems: TransmissionStem[];

  /** Information about the audio splitting operation for this Transmission. */
  splitOperation: ISplitOperation;
}
