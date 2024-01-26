import * as dotenv from "dotenv";
import express from "express";
import { connect as mongooseConnect } from "mongoose";
import createOpenApiValidatorMiddleware from "./middleware/openApiValidator.middleware.js";
import createTransmissionStorageMiddleware from "./middleware/transmissionStorage.middleware.js";
import transmissionRouter from "./routes/transmission.routes.js";

//
//  DEFAULTS
//

const DEFAULT_EXPRESS_PORT = 3000;
const DEFAULT_API_SPEC_PATH = "./openapi.yml";
const DEFAULT_DB_URL = "mongodb://localhost:27017";
const DEFAULT_FILE_DEST_PATH = "./.temp/uploads";

//
//  RUNTIME VARIABLES
//

// Load env vars from the `.env` file
dotenv.config();

const expressPort = process.env.EXPRESS_PORT || DEFAULT_EXPRESS_PORT;
const apiSpecPath = process.env.API_SPEC_PATH || DEFAULT_API_SPEC_PATH;
const dbUrl = process.env.DB_URL || DEFAULT_DB_URL;
const uploadFileDestPath = process.env.FILE_DEST_PATH || DEFAULT_FILE_DEST_PATH;

// Construct the Express application
const app = express();

//
//  Middleware
//

app.use(express.json());
app.use(createOpenApiValidatorMiddleware(apiSpecPath, uploadFileDestPath));
app.use(createTransmissionStorageMiddleware());

//
//  Routes
//

// Setup a default router
app.get("/", (req, res) => {
  res.send(JSON.stringify({ message: "Hello World!" }));
});

// Add the routers from the routes directory
app.use("/transmission", transmissionRouter);

// Handle any errors from express and wrap them as JSON
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err, req, res, next) => {
  // Report a catch-all for any errors.
  res.status(err.status || 500).json({
    message: err.message,
    errors: err.errors,
  });
});

//
//  Listen
//

// Connect to the DB
console.log(`Connecting to DB (${dbUrl})...`);
await mongooseConnect(dbUrl);

// ...Start the Express server!
console.log("Starting express...");
app.listen(expressPort, () => {
  console.log(`Listening on port ${expressPort}`);
});
