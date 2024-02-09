import { EventEmitter } from "events";
import { IncomingMessage } from "http";
import { nanoid } from "nanoid";
import { WebSocket, WebSocketServer } from "ws";

export interface IClientSession {
  client: WebSocket;
  server: WebSocketServer;
  connectionRequest: IncomingMessage;
  id: string;
}

export interface IEventMessage {
  event: string;
  data?: any;
}

export declare interface WebSocketHandler {
  on(event: "connect", listener: (session: IClientSession) => void);
  on(event: "disconnect", listener: (session: IClientSession) => void);
  on(event: "message", listener: (session: IClientSession, message: IEventMessage) => void);
}

export class WebSocketHandler extends EventEmitter {
  constructor(server: WebSocketServer) {
    super();

    server.on("connection", async (client, request) => {
      // Construct the session for this client
      const session: IClientSession = {
        client,
        server,
        connectionRequest: request,
        id: nanoid(),
      };

      // Call logic when client connects
      this.emit("connect", session);

      client.on("close", async () => {
        // Call logic when client disconnects
        this.emit("disconnect", session);
      });

      client.on("message", async (data) => {
        let eventMessage: IEventMessage | undefined;

        /**
         * Try to parse the data that the client has sent. If we fail to parse it for some reason
         * (there's no data, it's not encoded correctly, or it's not valid JSON) then send back an
         * error response.
         */
        try {
          // Parse out the sent UTF data
          let dataUtf: string;
          try {
            dataUtf = data.toString("utf-8");
          } catch (e) {
            throw new Error("Data was not utf-8");
          }

          // Parse the JSON data from the UTF-8 string
          let parsedData: any;
          try {
            parsedData = JSON.parse(dataUtf);
          } catch (e) {
            throw new Error("Failed to parse JSON from utf-8 data");
          }

          // Ensure that sent data has enough field for IEventMessage
          if (!("event" in parsedData)) {
            throw new Error("Message doesn't contain `event` field.");
          }

          // ...and if we make it here, we have an event message!
          eventMessage = parsedData as IEventMessage;
        } catch (e) {
          client.send(
            JSON.stringify({
              event: "error",
              message: e.toString(),
            }),
          );
        }

        if (eventMessage) {
          // Call logic when client sends a message to this server
          this.emit("message", session, eventMessage);
        }
      });
    });
  }
}
