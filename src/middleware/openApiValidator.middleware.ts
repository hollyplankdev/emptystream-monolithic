import * as OpenAPIValidator from "express-openapi-validator";
import mongoose from "mongoose";

/**
 * @param apiSpecPath Where the OpenAPI yaml specification is on disk.
 * @param uploadFileDestPath Where files parsed in multipart/form-data should be stored on disk.
 * @returns An OpenAPIValidator middleware instance.
 */
export default function create(apiSpecPath: string, uploadFileDestPath: string) {
  return OpenAPIValidator.middleware({
    apiSpec: apiSpecPath,
    validateRequests: {
      removeAdditional: "all",
    },
    validateResponses: true,
    fileUploader: {
      dest: uploadFileDestPath,
    },
    ignoreUndocumented: true,
    serDes: [
      {
        format: "mongo-objectid",
        deserialize: (s: string) => mongoose.Types.ObjectId.createFromHexString(s),
        serialize: (o: mongoose.Types.ObjectId) => o.toHexString(),
      },
    ],
  });
}
