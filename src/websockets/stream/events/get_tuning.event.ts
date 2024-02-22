import { StreamWebSocketHandler } from "../websocket.js";

const getTuningEvent: Parameters<StreamWebSocketHandler["onSpecificMessage"]>[1] = async (
  session,
) => {
  // TODO - ACTUALLY IMPLEMENT

  await session.messageClient({
    event: "give_tuning",
    wholeState: [{ index: 0, transmission: { id: "test", stem: "bass" } }],
  });
};
export default getTuningEvent;
