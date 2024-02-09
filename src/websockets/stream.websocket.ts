import { WebSocketServer } from "ws";
import { WebSocketHandler } from "./webSocketHandler.js";

export default function setupStreamWebSocketServer(server: WebSocketServer) {
  const handler = new WebSocketHandler(server);

  handler.on("connect", (session) => {
    console.log(`Client ${session.id} connected.`);
  });

  handler.on("disconnect", (session) => {
    console.log(`Client ${session.id} disconnected.`);
  });

  handler.on("message", (session, message) => {
    console.log(`Client ${session.id} sent ${message.event} event: ${message.data}`);
  });
}
