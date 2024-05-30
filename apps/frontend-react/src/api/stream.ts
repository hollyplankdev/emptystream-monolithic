/** @returns The URL of the websocket stream */
const getUrl = () => {
  // Thanks a lot to https://stackoverflow.com/a/47472874
  const url = new URL("/stream", window.location.href);
  url.protocol = url.protocol.replace("http", "ws");
  return url.href;
};

export default {
  getUrl,
};
