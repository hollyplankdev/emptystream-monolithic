import { Router } from "express";
import controller from "../controllers/transmission.controllers.js";

const transmissionRouter: Router = Router();

transmissionRouter.get("/:id", controller.read);
transmissionRouter.patch("/:id", controller.update);
transmissionRouter.delete("/:id", controller.remove);
transmissionRouter.get("/", controller.list);
transmissionRouter.post("/", controller.create);

export default transmissionRouter;
