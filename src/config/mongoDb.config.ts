/* eslint-disable import/prefer-default-export */
import * as dotenv from "dotenv";

//
//  Defaults
//

const DEFAULT_MONGODB_URL = "mongodb://localhost:27017";

//
//  Values
//

dotenv.config();

/** The URL to use when connecting to MongoDB. */
export const MONGODB_URL = process.env.MONGODB_URL || DEFAULT_MONGODB_URL;
