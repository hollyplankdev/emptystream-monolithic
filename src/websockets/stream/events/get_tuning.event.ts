import { OnSpecificMessageEventListener } from "../../webSocketHandler.js";
import { IClientMessages, IGetTuningMessage, IServerMessages } from "../messages.js";

const getTuningEvent: OnSpecificMessageEventListener<
  IClientMessages,
  IServerMessages,
  IGetTuningMessage
> = async (session) => {
  // TODO - ACTUALLY IMPLEMENT

  await session.messageClient({
    event: "give_tuning",
    wholeState: [{ index: 0, transmission: { id: "test", stem: "bass" } }],
  });
};
export default getTuningEvent;
