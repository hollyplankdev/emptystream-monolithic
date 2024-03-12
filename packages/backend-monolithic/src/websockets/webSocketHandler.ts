import { WebSocketMessage } from "@emptystream/shared";
import { EventEmitter } from "events";
import { IncomingMessage } from "http";
import { nanoid } from "nanoid";
import { WebSocket, WebSocketServer } from "ws";

/** Session data for the client of a WebSocket connection. */
export interface IClientSession<
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ClientEventMessageType extends WebSocketMessage.Base = WebSocketMessage.Base,
  ServerEventMessageType extends WebSocketMessage.Base = WebSocketMessage.Base,
> {
  /** The client that this session belongs to. */
  client: WebSocket;
  /** The server that this session's client is connected to. */
  server: WebSocketServer;
  /**
   * Data sent alongside this session's client's initial connection. Can be used to determine if
   * connections should be approved or denied when using auth, for example.
   */
  connectionRequest: IncomingMessage;

  /** The unique nanoID that represents this specific session. */
  id: string;

  /** Sends a message to this session's client. */
  messageClient(message: ServerEventMessageType | WebSocketMessage.Error): Promise<void>;
}

/**
 * A utility type to simplify getting the type of a WebSocketHandler's onConnect listener.
 *
 * TODO - Make this name shorter.
 */
export type OnConnectListener<HandlerType extends WebSocketHandler> = Parameters<
  HandlerType["onConnect"]
>[0];

/**
 * A utility type to simplify getting the type of a WebSocketHandler's onDisconnect listener.
 *
 * TODO - make this name shorter.
 */
export type OnDisconnectListener<HandlerType extends WebSocketHandler> = Parameters<
  HandlerType["onDisconnect"]
>[0];

/**
 * A utility type to simplify getting the type of a WebSocketHandler's onMessage listener.
 *
 * TODO - make this name shorter.
 */
export type OnMessageListener<HandlerType extends WebSocketHandler> = Parameters<
  HandlerType["onMessage"]
>[0];

/**
 * A utility type to simplify getting the type of a WebSocketHandler's onSpecificMessage listener.
 *
 * TODO - make this name shorter.
 */
export type OnSpecificMessageListener<
  HandlerType extends WebSocketHandler,
  SpecificMessage extends WebSocketMessage.Base,
> = (
  session: Parameters<Parameters<HandlerType["onSpecificMessage"]>[1]>[0],
  message: SpecificMessage,
) => void | Promise<void>;

/**
 * A wrapper class to make handling WebSocket interactions easier.
 *
 * - Creates an IClientSession object for each new WebSocket client.
 * - Uses an event emitter structure to allow for simpler code.
 * - Parses and handles data sent by the client and types it appropriately.
 * - Can be strongly typed by passing in an interface that extends from WebSocketMessage.Base
 */
export class WebSocketHandler<
  IClientMessages extends WebSocketMessage.Base = WebSocketMessage.Base,
  IServerMessages extends WebSocketMessage.Base = WebSocketMessage.Base,
> extends EventEmitter {
  /** A map that stores currently connected client sessions by their ID. */
  private sessions = new Map<string, IClientSession<IClientMessages, IServerMessages>>();

  /**
   * Create a new WebSocketHandler.
   *
   * @param server The WebSocketServer that this handler will use to listen to clients on.
   */
  constructor(server: WebSocketServer) {
    super();

    server.on("connection", async (client, request) => {
      // Define how the server should send messages back to the client
      const messageClientFunc: IClientSession<IClientMessages, IServerMessages>["messageClient"] = (
        message,
      ) =>
        new Promise<void>((resolve, reject) => {
          // Stringify the message...
          const encodedMessage = JSON.stringify(message);

          // Encode the message as utf-8 bytes, then send it to the client
          client.send(Buffer.from(encodedMessage, "utf-8"), (err) => {
            // Reject or resolve this in a promise-like fashion.
            if (err) {
              reject(err);
            } else {
              resolve();
            }
          });
        });

      // Construct the session for this client
      const session: IClientSession<IClientMessages, IServerMessages> = {
        client,
        server,
        connectionRequest: request,
        id: nanoid(),
        messageClient: messageClientFunc,
      };

      client.on("close", async () => {
        // Call logic when client disconnects
        this.emit("disconnect", session);

        // Stop keeping track of this client.
        this.sessions.delete(session.id);
      });

      client.on("message", async (data) => {
        let eventMessage: IClientMessages | undefined;

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

          // Ensure that sent data has enough field for WebSocketMessage.Base
          if (!("event" in parsedData)) {
            throw new Error("Message doesn't contain `event` field.");
          }

          // ...and if we make it here, we have an event message!
          eventMessage = parsedData as IClientMessages;
        } catch (e) {
          await session.messageClient({ event: "error", message: e.toString() });
        }

        if (eventMessage) {
          // Call logic when client sends a message to this server
          this.emit("message", session, eventMessage);
          this.emit(`${eventMessage.event}_message`, session, eventMessage);
        }
      });

      // Start keeping track of this client.
      this.sessions.set(session.id, session);

      // Call logic when client connects
      this.emit("connect", session);
    });
  }

  //
  //  Functions
  //

  /** @returns A list of all currently connected sessions. */
  public getSessions(): IClientSession<IClientMessages, IServerMessages>[] {
    return Array.from(this.sessions.values());
  }

  /**
   * @param id The ID of the session to get.
   * @returns The desired session, or undefined if not found.
   */
  public getSession(id: string): IClientSession<IClientMessages, IServerMessages> | undefined {
    return this.sessions.get(id);
  }

  /**
   * Called when a new WebSocket client has connected to this server. New clients can be denied
   * connection by checking their session's connection request, if desired.
   */
  public onConnect(
    listener: (session: IClientSession<IClientMessages, IServerMessages>) => void | Promise<void>,
  ) {
    this.on("connect", listener);
  }

  /** Called when a previously connected WebSocket client disconnects from this server. */
  public onDisconnect(
    listener: (session: IClientSession<IClientMessages, IServerMessages>) => void | Promise<void>,
  ) {
    this.on("disconnect", listener);
  }

  /** Called when a currently connected WebSocket client sends a valid message to this server. */
  public onMessage(
    listener: (
      session: IClientSession<IClientMessages, IServerMessages>,
      message: IClientMessages,
    ) => void | Promise<void>,
  ) {
    this.on("message", listener);
  }

  /** Called when a currently connected WebSocket client sends a specific message to this server. */
  public onSpecificMessage<ISpecificMessage extends IClientMessages>(
    event: ISpecificMessage["event"],
    listener: (
      session: IClientSession<IClientMessages, IServerMessages>,
      message: ISpecificMessage,
    ) => void | Promise<void>,
  ) {
    this.on(`${event}_message`, listener);
  }
}
