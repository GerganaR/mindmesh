import { Request, Response } from "express";
import * as graphService from "../services/graphService";
import { IGraphPayload } from "../models/Graph";

/**
 * Fetches all graphs or a specific graph by ID from the database
 * @param req - The request object
 * @param res - The response object
 * @returns - The response object
 */
export const getGraphsController = async (req: Request, res: Response) => {
  try {
    const graphs = await graphService.getAllGraphs();
    res.json(graphs);
  } catch (err) {
    console.error("💥 Backend: Error in getGraphsController:", err);
    res.status(500).json({ error: "Failed to fetch graphs" });
  }
};

export const getGraphByIdController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id || typeof id !== "string") {
      return res.status(400).json({ error: "Graph ID is required" });
    }
    const graph = await graphService.getGraphById(id);
    if (!graph) {
      return res.status(404).json({ error: "Graph not found" });
    }
    res.json(graph);
  } catch (err) {
    console.error("💥 Backend: Error in getGraphByIdController:", err);
    res.status(500).json({ error: "Failed to fetch graph" });
  }
};

/**
 * Saves a mind map to the database
 * @param req - The request object
 * @param res - The response object
 * @returns - The response object
 */
export const saveGraphController = async (req: Request, res: Response) => {
  try {
    const data = req.body as IGraphPayload;

    if (
      !data.title ||
      !data.nodes ||
      !data.edges ||
      data.nodeCount === undefined ||
      !data.lastModified ||
      !data.created
    ) {
      return res.status(400).json({
        error:
          "Title, nodes, edges, nodeCount, lastModified, and created are required",
      });
    }

    const graphData: IGraphPayload = {
      title: data.title,
      nodes: data.nodes,
      edges: data.edges,
      nodeCount: data.nodeCount,
      lastModified: data.lastModified,
      created: data.created,
    };

    const Graph = await graphService.saveGraph(undefined, graphData);
    res.json(Graph);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save mind map" });
  }
};

/**
 * Deletes a specific graph from the database
 * @param req - The request object
 * @param res - The response object
 * @returns - The response object
 */
export const deleteGraphController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id || typeof id !== "string") {
      return res.status(400).json({ error: "Graph ID is required" });
    }

    await graphService.deleteGraph(id);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    if (err instanceof Error && err.message === "Graph not found") {
      res.status(404).json({ error: "Graph not found" });
    } else {
      res.status(500).json({ error: "Failed to delete mind map" });
    }
  }
};

/**
 * Updates a specific graph in the database or creates a new one if id is not provided
 * @param req - The request object
 * @param res - The response object
 * @returns - The response object
 */
export const updateGraphController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = req.body as IGraphPayload;

    // Check if all required fields are present
    if (
      !data.title ||
      !data.nodes ||
      !data.edges ||
      data.nodeCount === undefined ||
      !data.lastModified ||
      !data.created
    ) {
      return res.status(400).json({
        error:
          "Title, nodes, edges, nodeCount, lastModified, and created are required",
      });
    }

    const graph = await graphService.updateGraph(id, data);
    res.json({ success: true, graph });
  } catch (err) {
    console.error("💥 Backend: Error in updateGraphController:", err);
    if (err instanceof Error && err.message === "Graph not found") {
      res.status(404).json({ error: "Mind map not found" });
    } else {
      res.status(500).json({ error: "Failed to update mind map" });
    }
  }
};
