import { StreamMessage } from "@emptystream/shared";
import { StreamState } from "../../../models/streamState.js";
import { OnSpecificMessageListener } from "../../webSocketHandler.js";
import { StreamWebSocketHandler } from "../websocket.js";

const getTuningEvent: OnSpecificMessageListener<
  StreamWebSocketHandler,
  StreamMessage.Client.GetTuning
> = async (session) => {
  // Get the current tunings
  const state = await StreamState.findOrCreateSingleton();

  // ...and send them!
  await session.messageClient({
    event: "give_tuning",
    tunings: state.tunings,
  });
};
export default getTuningEvent;
