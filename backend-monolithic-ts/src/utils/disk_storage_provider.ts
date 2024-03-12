import { Readable, Writable } from "stream";

/**
 * A structure that holds files in some sort of storage. Meant as a way to abstract between local
 * storage, future cloud storage, or perhaps even DB storage.
 */
export default interface DiskStorageProvider {
  /**
   * Create a readable stream to a specific file located in this storage provider.
   *
   * @param key The key to the file. Depending on the storage provider, this could be an ID, a file
   *   path, or some other unique identifier.
   * @returns The readable stream pointing to the desired file, or undefined if the file was not
   *   found.
   */
  createReadStream(key: string): Promise<Readable | undefined>;

  /**
   * Create a writable stream to a specific file located in this storage provider.
   *
   * @param key The key to the file. Depending on the storage provider, this could be an ID, a file
   *   path, or some other unique identifier.
   * @returns The writable stream pointing to the desired file, or a new file with that key.
   */
  createWriteStream(key: string): Promise<Writable>;
}
