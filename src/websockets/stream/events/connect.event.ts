import { StreamWebSocketHandler } from "../websocket.js";

const connectEvent: Parameters<StreamWebSocketHandler["onConnect"]>[0] = async (session) => {
  // TODO - send client a IStreamJoinMessage

  console.log(`Client ${session.id} connected.`);
};
export default connectEvent;
