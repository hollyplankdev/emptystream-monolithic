import { StreamState } from "../../../models/streamState.js";
import { OnSpecificMessageListener } from "../../webSocketHandler.js";
import { IGetTuningMessage } from "../messages.js";
import { StreamWebSocketHandler } from "../websocket.js";

const getTuningEvent: OnSpecificMessageListener<StreamWebSocketHandler, IGetTuningMessage> = async (
  session,
) => {
  // Get the current tunings
  const state = await StreamState.findOrCreateSingleton();

  // ...and send them!
  await session.messageClient({
    event: "give_tuning",
    tunings: state.tunings,
  });
};
export default getTuningEvent;
