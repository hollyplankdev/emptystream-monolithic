/* eslint-disable import/prefer-default-export */
import * as dotenv from "dotenv";

//
//  Defaults
//

const DEFAULT_HTTP_PORT = 3000;

//
//  Values
//

dotenv.config();

/** The port to use when exposing this HTTP server. */
export const HTTP_PORT: number =
  (process.env.HTTP_PORT ? parseInt(process.env.HTTP_PORT, 10) : null) || DEFAULT_HTTP_PORT;
