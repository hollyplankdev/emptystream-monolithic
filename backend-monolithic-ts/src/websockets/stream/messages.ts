import { IChannelTuning } from "../../models/streamState.js";
import { IEventMessage } from "../webSocketHandler.js";

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
  tunings: IChannelTuning[];
}

export interface ITuningChangedMessage extends IEventMessage {
  event: "tuning_changed";
  tuningUpdates: IChannelTuning[];
}

//
//  Consolidated Messages
//

export type IClientMessages = IGetTuningMessage;
export type IServerMessages = IGiveTuningMessage | ITuningChangedMessage;
