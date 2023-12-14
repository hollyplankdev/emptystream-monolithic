import * as dotenv from "dotenv";
import express from "express";

//
//  DEFAULTS
//

const DEFAULT_EXPRESS_PORT = 3000;

//
//  APPLICATION START
//

// Load env vars from the `.env` file
dotenv.config();

// Load our port either from env vars, or use the default
const expressPort = process.env.EXPRESS_PORT || DEFAULT_EXPRESS_PORT;

// Construct the Express application
const app = express();

// Setup a default router
app.get("/", (req, res) => {
  res.send(JSON.stringify({ message: "Hello World!" }));
});

// ...Start the Express server!
app.listen(expressPort, () => {
  console.log(`Listening on port ${expressPort}`);
});
