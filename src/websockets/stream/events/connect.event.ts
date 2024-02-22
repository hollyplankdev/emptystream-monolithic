import { GetOnConnectEventListenerType } from "../../webSocketHandler.js";
import { StreamWebSocketHandler } from "../websocket.js";

const connectEvent: GetOnConnectEventListenerType<StreamWebSocketHandler> = async (session) => {
  // TODO - send client a IStreamJoinMessage

  console.log(`Client ${session.id} connected.`);
};
export default connectEvent;
