/* eslint-disable import/prefer-default-export */
import * as dotenv from "dotenv";

//
//  Defaults
//

const DEFAULT_EXPRESS_PORT = 3000;

//
//  Values
//

dotenv.config();

/** The port to use when exposing this ExpressJS server. */
export const EXPRESS_PORT: number =
  (process.env.EXPRESS_PORT ? parseInt(process.env.EXPRESS_PORT, 10) : null) ||
  DEFAULT_EXPRESS_PORT;
