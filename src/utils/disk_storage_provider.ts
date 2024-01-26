import { Readable, Writable } from "stream";

export default interface DiskStorageProvider {
  /**
   * Create a readable stream to a specific file located in this storage provider.
   *
   * @param key The key to the file. Depending on the storage provider, this could be an ID, a file
   *   path, or some other unique identifier.
   */
  createReadStream(key: string): Promise<Readable | undefined>;

  /**
   * Create a writable stream to a specific file located in this storage provider.
   *
   * @param key The key to the file. Depending on the storage provider, this could be an ID, a file
   *   path, or some other unique identifier.
   */
  createWriteStream(key: string): Promise<Writable>;
}
