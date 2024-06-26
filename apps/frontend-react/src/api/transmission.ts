import { DbObject, ITransmission } from "@emptystream/shared";
import axios from "axios";

/**
 * Makes a request getting a single Transmission from the API, by it's ID. Not intended to be used
 * directly, use `useTransmissionQuerySingle` instead!
 *
 * @param id The id of the transmission to get.
 * @returns The Transmission with matching ID.
 * @throws AxiosError if result is non-200 status code.
 */
export async function apiGetTransmission(id: string): Promise<DbObject<ITransmission>> {
  const response = await axios.get(`transmission/${id}`);
  return response.data;
}

/**
 * Makes a request removing a single Transmission from the API, by it's ID. Not intended to be used
 * directly, use `useTransmissionMutationRemove` instead!
 *
 * @param id The id of the transmission to remove.
 * @throws AxiosError if result is non-200 status code.
 */
export async function apiRemoveTransmission(id: string): Promise<void> {
  await axios.delete(`transmission/${id}`);
}

/**
 * Makes a request creating a new Transmission in the API. Not intended to be used directly, use
 * `useTransmissionMutationCreate` instead!
 *
 * @param name The name of the new transmission to create.
 * @param audio The MP3 file for the new Transmission. As soon as this request succeeds, the server
 *   will start splitting this into stems.
 * @returns The newly created Transmission.
 * @throws AxiosError if result is non-200 status code.
 */
export async function apiCreateTransmission(
  name: string,
  audio: File,
): Promise<DbObject<ITransmission>> {
  // Format the data correctly
  const formData = new FormData();
  formData.append("name", name);
  formData.append("audio", audio);

  // Upload the transmission
  // Send the request!
  const response = await axios.postForm("transmission", formData);

  const transmission: DbObject<ITransmission> = response.data;
  return transmission;
}

/**
 * Makes a request getting a paginated list result of all Transmissions from the API. Not intended
 * to be used directly!
 *
 * @param args.lastPageKey OPTIONAL - The pageKey of a previous call. Providing this will make THIS
 *   call start where the last call left off.
 * @param args.pageSize OPTIONAL - The maximum number of results to return per-call.
 * @returns An object containing the key of the retrieved page, and all of the items within this
 *   page.
 * @throws AxiosError if result is non-200 status code.
 */
export async function apiListTransmissionPage(
  args: { lastPageKey?: number; pageSize?: number } = {},
): Promise<{ pageKey: number; items: DbObject<ITransmission>[] }> {
  const response = await axios.get("transmission", {
    params: {
      lastPageKey: args.lastPageKey,
      pageSize: args.pageSize,
    },
  });

  return response.data;
}

/**
 * Makes a request getting a list of ALL Transmissions from the API. Not intended to be used
 * directly, use `useTransmissionQueryAll` instead!
 *
 * @returns A list of every Transmission known to exist.
 * @throws AxiosError if result is non-200 status code.
 */
export async function apiListAllTransmissions(): Promise<DbObject<ITransmission>[]> {
  let lastPageKey: number | undefined;
  const foundItems: DbObject<ITransmission>[] = [];

  do {
    // eslint-disable-next-line no-await-in-loop
    const response = await apiListTransmissionPage({ lastPageKey });

    lastPageKey = response.pageKey;
    foundItems.push(...response.items);
  } while (lastPageKey);

  return foundItems;
}
