import { useEffect, useState } from "react";
import useWebSocket from "react-use-websocket";
import { getStreamWebsocketUrl } from "../api/stream";

export interface StreamSocketState {
  tunings: Map<number, IChannelTuning>;
}

const initialState: StreamSocketState = {
  tunings: new Map<number, IChannelTuning>(),
};

interface IChannelTuning {
  index: number;
  transmission: {
    id: string;
    stem: string;
  };
  startTime?: Date;
  transitionDuration?: Date;
}

interface IGiveTuningMessage {
  event: "give_tuning";
  tunings: IChannelTuning[];
}

interface ITuningChangedMessage {
  event: "tuning_changed";
  tuningUpdates: IChannelTuning[];
}

type WebSocketMessage = IGiveTuningMessage | ITuningChangedMessage;

/**
 * Obtains the websocket connection to the Stream API. Automatically reacts to new messages and
 * triggers an update if the stream state changes.
 *
 * @returns The currently known stream state.
 */
export function useStreamSocket() {
  const [state, setState] = useState(initialState);
  const { lastMessage } = useWebSocket(getStreamWebsocketUrl(), {
    share: true,
  });

  // Parse new messages
  useEffect(() => {
    // If theres no messages, EXIT
    if (lastMessage === null) return;

    async function parseLastMessage() {
      // Parse the last message as utf-8 text
      const dataAsText = await (lastMessage?.data as Blob).text();
      // Turn the text into JSON that we can work with
      const data = JSON.parse(dataAsText) as WebSocketMessage;

      // If ALL tunings are changed, update the state
      if (data.event === "tuning_changed") {
        setState((currentState) => {
          data.tuningUpdates.forEach((tuning) => {
            currentState.tunings.set(tuning.index, tuning);
          });
          return currentState;
        });
      }
      // If SOME tunings are changed, update the state
      else if (data.event === "give_tuning") {
        setState((currentState) => {
          data.tunings.forEach((tuning) => {
            currentState.tunings.set(tuning.index, tuning);
          });
          return currentState;
        });
      }
    }
    parseLastMessage();
  }, [lastMessage]);

  return { streamState: state };
}
