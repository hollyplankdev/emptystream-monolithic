import { DbObject, ITransmission } from "@emptystream/shared";
import axios from "axios";

const get = async (id: string): Promise<DbObject<ITransmission>> => {
  const response = await axios.get(`transmission/${id}`);

  return response.data;
};

/**
 * Upload a new Transmission.
 *
 * @param name The name of the new Transmission.
 * @param audio The MP3 file for the new Transmission. Will get split on the server.
 */
const upload = async (name: string, audio: File): Promise<DbObject<ITransmission>> => {
  // Format the data correctly
  const formData = new FormData();
  formData.append("name", name);
  formData.append("audio", audio);

  // Upload the transmission
  // Send the request!
  const response = await axios.postForm("transmission", formData);

  // TODO - Handle error from above
  // TODO - Flag that there may be new transmissions to display
  const transmission: DbObject<ITransmission> = response.data;
  return transmission;
};

const list = async (
  args: { lastPageKey?: number; pageSize?: number } = {},
): Promise<{ pageKey: number; items: DbObject<ITransmission>[] }> => {
  const response = await axios.get("transmission", {
    params: {
      lastPageKey: args.lastPageKey,
      pageSize: args.pageSize,
    },
  });

  return response.data;
};

const all = async (): Promise<DbObject<ITransmission>[]> => {
  let lastPageKey: number | undefined;
  const foundItems: DbObject<ITransmission>[] = [];

  do {
    // eslint-disable-next-line no-await-in-loop
    const response = await list({ lastPageKey });

    lastPageKey = response.pageKey;
    foundItems.push(...response.items);
  } while (lastPageKey);

  return foundItems;
};

export default {
  upload,
  list,
  all,
  get,
};
