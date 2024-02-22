import { IEventMessage } from "../webSocketHandler.js";
import { TuningChannelIndex, TuningTransmissionStem } from "./types.js";

//
//  Client Messages
//

export interface IGetTuningMessage extends IEventMessage {
  event: "get_tuning";
}

//
//  Server Messages
//

//
//  Server Messages
//
export interface IGiveTuningMessage extends IEventMessage {
  event: "give_tuning";
  wholeState: Array<{
    index: TuningChannelIndex;
    transmission: TuningTransmissionStem;
  }>;
}

export interface ITuningChangedMessage extends IEventMessage {
  event: "tuning_changed";
  updates: Array<{
    index: TuningChannelIndex;
    transmission: TuningTransmissionStem;
  }>;
}

//
//  Consolidated Messages
//

export type IClientMessages = IGetTuningMessage | { event: "test"; thing: boolean };
export type IServerMessages = IGiveTuningMessage | ITuningChangedMessage;
