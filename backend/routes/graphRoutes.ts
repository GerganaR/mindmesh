import { Router } from "express";
import {
  getGraphs,
  getGraphById,
  createGraph,
  updateGraph,
  deleteGraph,
} from "../controllers/graphController";
const router = Router();

// Graph routes
router.get("/", getGraphs);
router.get("/:id", getGraphById);
router.post("/", createGraph);
router.put("/:id", updateGraph);
router.delete("/:id", deleteGraph);

export default router;
