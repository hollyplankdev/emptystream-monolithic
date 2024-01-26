import * as fsPromise from "fs/promises";
import * as fs from "fs";
import * as path from "path";
import { Readable, Writable } from "stream";
import DiskStorageProvider from "./disk_storage_provider.js";

export default class LocalDiskStorageProvider implements DiskStorageProvider {
  /** The base location that all files will be read from and written to, under this provider. */
  private basePath: string;

  //
  //  Init
  //

  constructor() {
    this.basePath = path.join(process.cwd(), ".local_storage");
  }

  //
  //  Public Functions
  //

  public async createReadStream(key: string): Promise<Readable> {
    // Create a stream that allows us to write the file to disk
    return fs.createReadStream(this.createLocalPath(key));
  }

  public async createWriteStream(key: string): Promise<Writable> {
    // Ensure that the correct path exists
    await fsPromise.mkdir(path.dirname(this.createLocalPath(key)), { recursive: true });

    // Create a stream that allows us to write the file to disk
    return fs.createWriteStream(this.createLocalPath(key));
  }

  //
  //  Private Functions
  //

  /**
   * Given a relative path, turn it into a full local path
   *
   * @param relativePath The relative path to transform
   * @returns A path combining basePath and relativePath
   */
  private createLocalPath(relativePath: string): string {
    return path.join(this.basePath, relativePath);
  }
}
