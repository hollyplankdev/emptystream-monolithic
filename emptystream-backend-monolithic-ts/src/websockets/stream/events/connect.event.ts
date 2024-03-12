import { OnConnectListener } from "../../webSocketHandler.js";
import { StreamWebSocketHandler } from "../websocket.js";
import getTuningEvent from "./get_tuning.event.js";

const connectEvent: OnConnectListener<StreamWebSocketHandler> = async (session) => {
  console.log(`Client ${session.id} connected.`);

  // Act as if the user has just requested tuning, and send them the current tuning values.
  await getTuningEvent(session, { event: "get_tuning" });
};
export default connectEvent;
