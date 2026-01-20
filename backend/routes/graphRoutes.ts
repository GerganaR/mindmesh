import { Router } from "express";
import * as graphController from "../controllers/graphController";

const router = Router();

// Graph routes
router.get("/", graphController.getGraphsController);
router.get("/:id", graphController.getGraphsController);
router.post("/", graphController.saveGraphController);
router.put("/:id", graphController.updateGraphController);
router.delete("/:id", graphController.deleteGraphController);

export default router;
