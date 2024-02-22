import { WebSocketServer } from "ws";
import { WebSocketHandler } from "../webSocketHandler.js";
import { IClientMessages, IServerMessages } from "./messages.js";
import connectEvent from "./events/connect.event.js";
import disconnectEvent from "./events/disconnect.event.js";
import getTuningEvent from "./events/get_tuning.event.js";

export class StreamWebSocketHandler extends WebSocketHandler<IClientMessages, IServerMessages> {}

export function setupServer(server: WebSocketServer): StreamWebSocketHandler {
  const handler = new StreamWebSocketHandler(server);

  handler.on("connect", connectEvent);
  handler.on("disconnect", disconnectEvent);
  handler.on("get_tuning_message", getTuningEvent);

  return handler;
}
