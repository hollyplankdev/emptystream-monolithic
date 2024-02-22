import { WebSocketServer } from "ws";
import { IEventMessage, WebSocketHandler } from "./webSocketHandler.js";

type TuningChannelIndex = 0 | 1 | 2 | 3;
type TuningTransmissionStem = { id: string; stem: "other" | "bass" | "drums" | "vocals" };

//
//  Client Messages
//

export interface IStreamGetTuningMessage extends IEventMessage {
  event: "get_tuning";
}

//
//  Server Messages
//
export interface IStreamGiveTuningMessage extends IEventMessage {
  event: "give_tuning";
  wholeState: Array<{
    index: TuningChannelIndex;
    transmission: TuningTransmissionStem;
  }>;
}

export interface IStreamTuningChangedMessage extends IEventMessage {
  event: "tuning_changed";
  updates: Array<{
    index: TuningChannelIndex;
    transmission: TuningTransmissionStem;
  }>;
}

export type IStreamClientMessages = IStreamGetTuningMessage;
export type IStreamServerMessages = IStreamGiveTuningMessage | IStreamTuningChangedMessage;

export default function setupStreamWebSocketServer(server: WebSocketServer) {
  const handler = new WebSocketHandler<IStreamClientMessages, IStreamServerMessages>(server);

  handler.on("connect", async (session) => {
    // TODO - send client a IStreamJoinMessage

    console.log(`Client ${session.id} connected.`);
  });

  handler.on("disconnect", (session) => {
    console.log(`Client ${session.id} disconnected.`);
  });

  handler.on("get_tuning_message", async (session) => {
    // TODO - ACTUALLY IMPLEMENT

    await session.messageClient({
      event: "give_tuning",
      wholeState: [{ index: 0, transmission: { id: "test", stem: "bass" } }],
    });
  });
}
