import { WebSocketServer } from "ws";
import { WebSocketHandler } from "../webSocketHandler.js";
import { IClientMessages, IServerMessages } from "./messages.js";
import connectEvent from "./events/connect.event.js";
import disconnectEvent from "./events/disconnect.event.js";
import getTuningEvent from "./events/get_tuning.event.js";

export class StreamWebSocketHandler extends WebSocketHandler<IClientMessages, IServerMessages> {}

export function setupServer(server: WebSocketServer): StreamWebSocketHandler {
  const handler = new StreamWebSocketHandler(server);

  handler.onConnect(connectEvent);
  handler.onDisconnect(disconnectEvent);
  handler.onSpecificMessage("get_tuning", getTuningEvent);

  return handler;
}
