import { OnConnectEventListener } from "../../webSocketHandler.js";
import { IClientMessages, IServerMessages } from "../messages.js";

const connectEvent: OnConnectEventListener<IClientMessages, IServerMessages> = async (session) => {
  // TODO - send client a IStreamJoinMessage

  console.log(`Client ${session.id} connected.`);
};
export default connectEvent;
