import { OnDisconnectListener } from "../../webSocketHandler.js";
import { StreamWebSocketHandler } from "../websocket.js";

const disconnectEvent: OnDisconnectListener<StreamWebSocketHandler> = async (session) => {
  console.log(`Client ${session.id} disconnected.`);
};
export default disconnectEvent;
