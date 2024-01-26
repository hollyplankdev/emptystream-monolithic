import * as path from "path";
import { Writable, Readable } from "stream";
import DiskStorageProvider from "./disk_storage_provider.js";

/** Values that Transmission stems types are allowed to be */
export type StemType = ["source", "drums", "bass", "vocals", "other"];

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

  public async createStemWriteStream(transmissionId: string, type: StemType): Promise<Writable> {
    return this.storage.createWriteStream(this.createFileKey(transmissionId, type));
  }

  public async createStemReadStream(transmissionId: string, type: StemType): Promise<Readable> {
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
  private createFileKey(transmissionId: string, type: StemType): string {
    return path.join("transmissions", transmissionId, `${type}${this.fileExtension}`);
  }
}

/** Tell TypeScript that Requests may potentially hold TransmissionStorage */
declare global {
  namespace Express {
    interface Request {
      transmissionStorage?: TransmissionStorage;
    }
  }
}
