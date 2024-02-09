import express from "express";
import { createServer } from "http";
import { connect as mongooseConnect } from "mongoose";
import path from "path";
import { API_SPEC_PATH } from "./config/apiValidator.config.js";
import { HTTP_PORT } from "./config/http.config.js";
import { MONGODB_URL } from "./config/mongoDb.config.js";
import { MULTER_FILE_DEST_PATH } from "./config/multer.config.js";
import createOpenApiValidatorMiddleware from "./middleware/openApiValidator.middleware.js";
import createTransmissionStorageMiddleware from "./middleware/transmissionStorage.middleware.js";
import splitAudioQueue from "./queue/splitAudio.queue.js";
import transmissionRouter from "./routes/transmission.routes.js";

// Construct the Express application
const app = express();

// Construct the HTTP server
const httpServer = createServer(app);

//
//  Middleware
//

app.use(express.json());
app.use(createOpenApiValidatorMiddleware(API_SPEC_PATH, MULTER_FILE_DEST_PATH));
app.use(createTransmissionStorageMiddleware());

//
//  Queue Workers
//

splitAudioQueue.createWorker();

//
//  Routes
//

// Setup a default router
app.get("/", (req, res) => {
  res.send(JSON.stringify({ message: "Hello World!" }));
});

app.use(express.static(path.join(process.cwd(), "static")));

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
console.log(`Connecting to DB (${MONGODB_URL})...`);
await mongooseConnect(MONGODB_URL);

// ...Start the HTTP server!
console.log("Starting HTTP server...");
httpServer.listen(HTTP_PORT, () => {
  console.log(`Listening on port ${HTTP_PORT}`);
});
