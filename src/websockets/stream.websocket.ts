import { WebSocketServer } from "ws";
import { IEventMessage, WebSocketHandler } from "./webSocketHandler.js";

type TuningChannelIndex = 0 | 1 | 2 | 3;
type TuningTransmissionStem = { id: string; stem: "other" | "bass" | "drums" | "vocals" };

export interface IStreamJoinMessage extends IEventMessage {
  event: "join";
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

export type IStreamEventMessage = IStreamJoinMessage | IStreamTuningChangedMessage;

export default function setupStreamWebSocketServer(server: WebSocketServer) {
  const handler = new WebSocketHandler<IStreamEventMessage>(server);

  handler.on("connect", (session) => {
    console.log(`Client ${session.id} connected.`);
  });

  handler.on("disconnect", (session) => {
    console.log(`Client ${session.id} disconnected.`);
  });

  handler.on("message", (session, message) => {
    console.log(`Client ${session.id} sent ${message.event}`);
  });
}
