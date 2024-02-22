import { EventEmitter } from "events";
import { IncomingMessage } from "http";
import { nanoid } from "nanoid";
import { WebSocket, WebSocketServer } from "ws";

/** Session data for the client of a WebSocket connection. */
export interface IClientSession<
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ClientEventMessageType extends IEventMessage = IEventMessage,
  ServerEventMessageType extends IEventMessage = IEventMessage,
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
  messageClient(message: ServerEventMessageType | IEventErrorMessage): Promise<void>;
}

/**
 * A message sent on a WebSocket connection indicating an event. Can be extended and passed into a
 * WebSocketHandler to strongly type it!
 */
export interface IEventMessage {
  /** The name of the event that this message represents. */
  event: string;
}

/** An error message sent on a WebSocket connection. */
export interface IEventErrorMessage extends IEventMessage {
  event: "error";
  message: string;
}

/** A function to call when a new client connects. */
export type OnConnectEventListener<
  IClientMessages extends IEventMessage,
  IServerMessages extends IEventMessage,
> = (session: IClientSession<IClientMessages, IServerMessages>) => void | Promise<void>;

/** A function to call when an existing client disconnects. */
export type OnDisconnectEventListener<
  IClientMessages extends IEventMessage,
  IServerMessages extends IEventMessage,
> = (session: IClientSession<IClientMessages, IServerMessages>) => void | Promise<void>;

/** A function to call when an existing client sends a message of any type. */
export type OnMessageEventListener<
  IClientMessages extends IEventMessage,
  IServerMessages extends IEventMessage,
> = (
  session: IClientSession<IClientMessages, IServerMessages>,
  message: IClientMessages,
) => void | Promise<void>;

/** A function to call when an existing client sends a strongly typed message. */
export type OnSpecificMessageEventListener<
  IClientMessages extends IEventMessage,
  IServerMessages extends IEventMessage,
  ISpecificMessage extends IEventMessage,
> = (
  session: IClientSession<IClientMessages, IServerMessages>,
  message: ISpecificMessage,
) => void | Promise<void>;

/** Strongly type the EventEmitter part of the WebSocketHandler. */
export declare interface WebSocketHandler<
  IClientMessages extends IEventMessage = IEventMessage,
  IServerMessages extends IEventMessage = IEventMessage,
> {
  /**
   * Called when a new WebSocket client has connected to this server. New clients can be denied
   * connection by checking their session's connection request, if desired.
   */
  on(event: "connect", listener: OnConnectEventListener<IClientMessages, IServerMessages>);

  /** Called when a previously connected WebSocket client disconnects from this server. */
  on(event: "disconnect", listener: OnDisconnectEventListener<IClientMessages, IServerMessages>);

  /** Called when a currently connected WebSocket client sends a valid message to this server. */
  on(event: "message", listener: OnMessageEventListener<IClientMessages, IServerMessages>);

  /** Called when a currently connected WebSocket client sends a specific message to this server. */
  on(
    event: `${IClientMessages["event"]}_message`,
    listener: OnSpecificMessageEventListener<IClientMessages, IServerMessages, IClientMessages>,
  );
}

/**
 * A wrapper class to make handling WebSocket interactions easier.
 *
 * - Creates an IClientSession object for each new WebSocket client.
 * - Uses an event emitter structure to allow for simpler code.
 * - Parses and handles data sent by the client and types it appropriately.
 * - Can be strongly typed by passing in an interface that extends from IEventMessage in order to
 *   determine what messages are expected.
 */
export class WebSocketHandler<
  IClientMessages extends IEventMessage = IEventMessage,
  IServerMessages extends IEventMessage = IEventMessage,
> extends EventEmitter {
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

      // Call logic when client connects
      this.emit("connect", session);

      client.on("close", async () => {
        // Call logic when client disconnects
        this.emit("disconnect", session);
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

          // Ensure that sent data has enough field for IEventMessage
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
    });
  }
}
