import { Router } from "express";
import controller from "../controllers/stream.controllers.js";

const streamRouter: Router = Router();

streamRouter.get("/", controller.read);
streamRouter.post("/tune", controller.tune);

export default streamRouter;
