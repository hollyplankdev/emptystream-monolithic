import { GetOnSpecificMessageEventListener } from "../../webSocketHandler.js";
import { StreamWebSocketHandler } from "../websocket.js";

const getTuningEvent: GetOnSpecificMessageEventListener<StreamWebSocketHandler> = async (
  session,
) => {
  // TODO - ACTUALLY IMPLEMENT

  await session.messageClient({
    event: "give_tuning",
    wholeState: [{ index: 0, transmission: { id: "test", stem: "bass" } }],
  });
};
export default getTuningEvent;
