/* eslint-disable import/prefer-default-export */
import * as dotenv from "dotenv";

//
//  Defaults
//

const DEFAULT_MULTER_FILE_DEST_PATH = "./.temp/uploads";

//
//  Values
//

dotenv.config();

/** The local path to use when multer stores files. */
export const MULTER_FILE_DEST_PATH =
  process.env.MULTER_FILE_DEST_PATH || DEFAULT_MULTER_FILE_DEST_PATH;
