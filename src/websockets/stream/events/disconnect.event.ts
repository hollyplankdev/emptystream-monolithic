import { StreamWebSocketHandler } from "../websocket.js";

const disconnectEvent: Parameters<StreamWebSocketHandler["onDisconnect"]>[0] = async (session) => {
  console.log(`Client ${session.id} disconnected.`);
};
export default disconnectEvent;
