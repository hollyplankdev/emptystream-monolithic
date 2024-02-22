import { OnConnectListener } from "../../webSocketHandler.js";
import { StreamWebSocketHandler } from "../websocket.js";

const connectEvent: OnConnectListener<StreamWebSocketHandler> = async (session) => {
  // TODO - send client a IStreamJoinMessage

  console.log(`Client ${session.id} connected.`);
};
export default connectEvent;
