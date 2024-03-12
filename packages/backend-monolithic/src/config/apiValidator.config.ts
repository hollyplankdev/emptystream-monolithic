/* eslint-disable import/prefer-default-export */
import * as dotenv from "dotenv";

//
//  Defaults
//

const DEFAULT_API_SPEC_PATH = "./openapi.yml";

//
//  Values
//

dotenv.config();

/** The file path to the OpenAPI specification. */
export const API_SPEC_PATH: string = process.env.API_SPEC_PATH || DEFAULT_API_SPEC_PATH;
