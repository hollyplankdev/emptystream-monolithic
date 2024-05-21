/* eslint-disable import/prefer-default-export */

import { useStreamSocket } from "../features/streamSocket/useStreamSocket";

/** @returns The URL of the websocket stream */
export function getUrl() {
  // Thanks a lot to https://stackoverflow.com/a/47472874
  const url = new URL("/stream", window.location.href);
  url.protocol = url.protocol.replace("http", "ws");
  return url.href;
}

/** Wrapper around `useStreamSocket` for the stream endpoint. */
export function useStreamApiSocket() {
  return useStreamSocket({ websocketURL: getUrl() });
}
