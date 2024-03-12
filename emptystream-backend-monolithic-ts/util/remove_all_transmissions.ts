/* eslint-disable no-await-in-loop */
/* eslint-disable no-underscore-dangle */
import fetch from "node-fetch";

const url = "http://127.0.0.1:3000";

async function removeTransmission(id: string): Promise<void> {
  console.log(`Removing "${id}"...`);

  const endpoint = `${url}/transmission/${id}`;
  const response = await fetch(endpoint, { method: "DELETE" });
  if (response.status !== 200) throw new Error(response.status.toString());
}

async function getTransmissionPage(pageSize: number = 8, lastPageKey?: string) {
  let endpoint = `${url}/transmission?pageSize=${pageSize}`;
  if (lastPageKey) endpoint += `&lastPageKey=${lastPageKey}`;

  const response = await fetch(endpoint, { method: "GET" });
  if (response.status !== 200) throw new Error(response.status.toString());

  const data = (await response.json()) as { pageKey?: string; items: { _id: string }[] };
  return data;
}

// Loop removing
let foundItemCount: number = 0;
do {
  // eslint-disable-next-line no-await-in-loop
  const transmissions = await getTransmissionPage();

  foundItemCount = transmissions.items.length;
  console.log(`Found ${foundItemCount} items`);

  // Create a list of promises that delete every transmission found above
  const deletePromises = transmissions.items.map((item) => removeTransmission(item._id));

  // Wait for all of the promises above to finish in parallel
  await Promise.all(deletePromises);
} while (foundItemCount > 0);
