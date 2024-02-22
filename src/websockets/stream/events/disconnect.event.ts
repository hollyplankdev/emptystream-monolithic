import { OnDisconnectEventListener } from "../../webSocketHandler.js";
import { IClientMessages, IServerMessages } from "../messages.js";

const disconnectEvent: OnDisconnectEventListener<IClientMessages, IServerMessages> = async (
  session,
) => {
  console.log(`Client ${session.id} disconnected.`);
};
export default disconnectEvent;
