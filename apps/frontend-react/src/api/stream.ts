/* eslint-disable import/prefer-default-export */

/** @returns The URL of the websocket stream */
export function getStreamWebsocketUrl() {
  // Thanks a lot to https://stackoverflow.com/a/47472874
  const url = new URL("/stream", window.location.href);
  url.protocol = url.protocol.replace("http", "ws");
  return url.href;
}
