/**
 * Upload a new Transmission.
 *
 * @param name The name of the new Transmission.
 * @param audio The MP3 file for the new Transmission. Will get split on the server.
 */
const upload = async (name: string, audio: File): Promise<void> => {
  // Format the data correctly
  const formData = new FormData();
  formData.append("name", name);
  formData.append("audio", audio);

  // Upload the transmission
  // Send the request!
  await new Promise<void>((resolve) => {
    setTimeout(() => resolve(), 2000);
  });
  // const response = await fetch("http://localhost:3000/transmission", {
  //   method: "POST",
  //   body: formData,
  // });

  // TODO - re-enable actual POST request
  // TODO - Handle error from above
  // TODO - Flag that there may be new transmissions to display
};

const list = async (lastPageKey: number, pageSize?: number): Promise<void> => {
  // TODO
};

export default {
  upload,
  list,
};
