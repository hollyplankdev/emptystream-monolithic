/** Information about a demucs stem-splitting job. */
export interface ISplitOperation {
  /** The current status of the operation. */
  status: string;

  /** How complete the operation is, from 0-100. */
  percentage: number;
}
