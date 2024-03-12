export namespace WebSocketMessage {
  /**
   * The base message type sent on a WebSocket connection indicating an event. Can be extended and
   * passed into a WebSocketHandler to strongly type it!
   */
  export interface Base {
    /** The name of the event that this message represents. */
    event: string;
  }

  /** An error message sent on a WebSocket connection. */
  export interface Error extends Base {
    event: "error";
    message: string;
  }
}
