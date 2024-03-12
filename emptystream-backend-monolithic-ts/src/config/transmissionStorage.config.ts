/* eslint-disable import/prefer-default-export */
import TransmissionStorage from "../utils/transmission_storage.js";
import LocalDiskStorageProvider from "../utils/local_disk_storage_provider.js";

/** @returns The client for interfacing with TransmissionStorage in some way. */
export function getTransmissionStorageClient() {
  const provider = new LocalDiskStorageProvider();
  return new TransmissionStorage(provider);
}
