import { ChannelTuning } from "./ChannelTuning";
import { WebSocketMessage } from "./WebSocketMessage";

/** Messages used as part of the Stream WebSocket service. */
export namespace StreamMessage {
  /** Messages sent FROM the client, TO the server. */
  export namespace Client {
    export interface GetTuning extends WebSocketMessage.Base {
      event: "get_tuning";
    }
  }

  /** Any messages from the client */
  export type FromClient = Client.GetTuning;

  /** Messages sent FROM the server, TO the client. */
  export namespace Server {
    export interface GiveTuning extends WebSocketMessage.Base {
      event: "give_tuning";
      tunings: ChannelTuning[];
    }

    export interface TuningChanged extends WebSocketMessage.Base {
      event: "tuning_changed";
      tuningUpdates: ChannelTuning[];
    }
  }

  /** Any messages from the server */
  export type FromServer = Server.GiveTuning | Server.TuningChanged;
}
