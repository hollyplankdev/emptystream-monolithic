import { IncomingMessage } from "http";
import { nanoid } from "nanoid";
import { RawData, WebSocket, WebSocketServer } from "ws";

interface IClientSession {
  client: WebSocket;
  server: WebSocketServer;
  connectionRequest: IncomingMessage;
  id: string;
}

async function onClientConnect(session: IClientSession) {
  console.log(`Got new client! (${session.id})`);
  session.client.send("Hello new client!");
}

async function onClientDisconnect(session: IClientSession) {
  console.log(`Lost client. (${session.id})`);
}

async function onClientMessage(session: IClientSession, data: RawData) {
  console.log(`Got message: ${data.toString("utf-8").replace("\n", "")}`);
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
      // Call logic when client sends a message to this server
      await onClientMessage(session, data);
    });
  });
}
