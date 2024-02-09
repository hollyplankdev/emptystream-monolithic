import { IncomingMessage } from "http";
import { nanoid } from "nanoid";
import { WebSocket, WebSocketServer } from "ws";

interface IClientSession {
  client: WebSocket;
  server: WebSocketServer;
  connectionRequest: IncomingMessage;
  id: string;
}

interface IEventMessage {
  event: string;
  data?: any;
}

async function onClientConnect(session: IClientSession) {
  console.log(`Got new client! (${session.id})`);
  session.client.send("Hello new client!");
}

async function onClientDisconnect(session: IClientSession) {
  console.log(`Lost client. (${session.id})`);
}

async function onClientMessage(session: IClientSession, message: IEventMessage) {
  console.log(`Got event ${message.event}: ${message.data}`);
}

export default function setupStreamWebSocketServer(server: WebSocketServer) {
  server.on("connection", async (client, request) => {
    // Construct the session for this client
    const session: IClientSession = {
      client,
      server,
      connectionRequest: request,
      id: nanoid(),
    };

    // Call logic when client connects
    await onClientConnect(session);

    client.on("close", async () => {
      // Call logic when client disconnects
      await onClientDisconnect(session);
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
        await onClientMessage(session, eventMessage);
      }
    });
  });
}
