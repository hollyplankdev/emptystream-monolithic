import * as OpenAPIValidator from "express-openapi-validator";

export default function create(apiSpecPath: string) {
  return OpenAPIValidator.middleware({
    apiSpec: apiSpecPath,
    validateRequests: true,
    validateResponses: true,
  });
}
