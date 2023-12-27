import * as OpenAPIValidator from "express-openapi-validator";

/**
 * @param apiSpecPath Where the OpenAPI yaml specification is on disk.
 * @param uploadFileDestPath Where files parsed in multipart/form-data should be stored on disk.
 * @returns An OpenAPIValidator middleware instance.
 */
export default function create(apiSpecPath: string, uploadFileDestPath: string) {
  return OpenAPIValidator.middleware({
    apiSpec: apiSpecPath,
    validateRequests: true,
    validateResponses: true,
    fileUploader: {
      dest: uploadFileDestPath,
    },
  });
}
