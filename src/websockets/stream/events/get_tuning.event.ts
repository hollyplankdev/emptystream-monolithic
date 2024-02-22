import { OnSpecificMessageListener } from "../../webSocketHandler.js";
import { IGetTuningMessage } from "../messages.js";
import { StreamWebSocketHandler } from "../websocket.js";

const getTuningEvent: OnSpecificMessageListener<StreamWebSocketHandler, IGetTuningMessage> = async (
  session,
) => {
  // TODO - ACTUALLY IMPLEMENT

  await session.messageClient({
    event: "give_tuning",
    wholeState: [{ index: 0, transmission: { id: "test", stem: "bass" } }],
  });
};
export default getTuningEvent;
