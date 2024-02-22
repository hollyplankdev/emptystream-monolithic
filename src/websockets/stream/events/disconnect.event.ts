import { GetOnDisconnectEventListener } from "../../webSocketHandler.js";
import { StreamWebSocketHandler } from "../websocket.js";

const disconnectEvent: GetOnDisconnectEventListener<StreamWebSocketHandler> = async (session) => {
  console.log(`Client ${session.id} disconnected.`);
};
export default disconnectEvent;
