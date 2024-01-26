import * as path from "path";
import { Writable, Readable } from "stream";
import DiskStorageProvider from "./disk_storage_provider.js";

/** Values that Transmission stems types are allowed to be */
export type StemType = "source" | "drums" | "bass" | "vocals" | "other";

/** A wrapper around DiskStorageProvider that allows for simple access to Transmission Stems. */
export default class TransmissionStorage {
  private storage: DiskStorageProvider;

  private fileExtension: string = ".mp3";

  //
  //  Init
  //

  constructor(storageProvider: DiskStorageProvider) {
    this.storage = storageProvider;
  }

  //
  //  Public Methods
  //

  /**
   * Create a Writable stream pointing to the desired Transmission Stem.
   *
   * @param transmissionId The ID of the transmission to write to.
   * @param type The type of stem to write to.
   * @returns A Writable stream.
   */
  public async createStemWriteStream(
    transmissionId: string,
    type: StemType | string,
  ): Promise<Writable> {
    return this.storage.createWriteStream(this.createFileKey(transmissionId, type));
  }

  /**
   * Create a Readable stream pointing to the desired Transmission Stem.
   *
   * @param transmissionId The ID of the transmission to read.
   * @param type The type of stem to read from.
   * @returns A Readable stream, or undefined if not found.
   */
  public async createStemReadStream(
    transmissionId: string,
    type: StemType | string,
  ): Promise<Readable | undefined> {
    return this.storage.createReadStream(this.createFileKey(transmissionId, type));
  }

  //
  //  Private Methods
  //

  /**
   * Creates a file key string as a path in the format of: "transmissions/id/type.mp3"
   *
   * @param transmissionId The ID of the transmission to look in
   * @param type The specific type of stem to address
   */
  private createFileKey(transmissionId: string, type: StemType | string): string {
    return path.join("transmissions", transmissionId, `${type}${this.fileExtension}`);
  }
}

/** Tell TypeScript that Requests will hold TransmissionStorage */
declare global {
  namespace Express {
    interface Request {
      transmissionStorage: TransmissionStorage;
    }
  }
}
