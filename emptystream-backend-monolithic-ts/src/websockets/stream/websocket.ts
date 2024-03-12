import { StreamMessage } from "emptystream-shared-ts";
import { createClient as createRedisClient } from "redis";
import { WebSocketServer } from "ws";
import { getRedisConnectionOptions } from "../../config/redis.config.js";
import { WebSocketHandler } from "../webSocketHandler.js";
import connectEvent from "./events/connect.event.js";
import disconnectEvent from "./events/disconnect.event.js";
import getTuningEvent from "./events/get_tuning.event.js";
import setupTuningsUpdatedEvent from "./events/setupTuningsUpdated.event.js";

export class StreamWebSocketHandler extends WebSocketHandler<
  StreamMessage.FromClient,
  StreamMessage.FromServer
> {}

export async function setupServer(server: WebSocketServer): Promise<StreamWebSocketHandler> {
  const handler = new StreamWebSocketHandler(server);

  handler.onConnect(connectEvent);
  handler.onDisconnect(disconnectEvent);
  handler.onSpecificMessage("get_tuning", getTuningEvent);

  const redisClient = createRedisClient(getRedisConnectionOptions());
  await redisClient.connect();
  await setupTuningsUpdatedEvent(handler, redisClient);

  return handler;
}
