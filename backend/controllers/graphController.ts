import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import * as graphService from "../services/graphService";
import { AppError } from "../utils/AppError";

/**
 * @desc    Get all graphs
 * @route   GET /api/graph
 * @access  Public
 */
export const getGraphs = asyncHandler(async (req: Request, res: Response) => {
  const graphs = await graphService.getAllGraphs();
  res.status(200).json(graphs);
});

/**
 * @desc    Get graph by ID
 * @route   GET /api/graph/:id
 * @access  Public
 */
export const getGraphById = asyncHandler(
  async (req: Request, res: Response) => {
    const graph = await graphService.getGraphById(req.params.id);
    if (!graph) {
      throw new AppError("Graph not found", 404);
    }
    res.status(200).json(graph);
  },
);

/**
 * @desc    Create a new graph
 * @route   POST /api/graph
 * @access  Public
 */
export const createGraph = asyncHandler(async (req: Request, res: Response) => {
  const { title } = req.body;
  if (!title) {
    throw new AppError("Title is required", 400);
  }
  const graph = await graphService.createGraph(req.body);
  res.status(201).json(graph);
});

/**
 * @desc    Update a graph
 * @route   PUT /api/graph/:id
 * @access  Public
 */
export const updateGraph = asyncHandler(async (req: Request, res: Response) => {
  const { title } = req.body;
  if (!title) {
    throw new AppError("Title is required", 400);
  }
  const graph = await graphService.updateGraph(req.params.id, req.body);
  if (!graph) {
    throw new AppError("Graph not found", 404);
  }
  res.status(200).json(graph);
});

/**
 * @desc    Delete a graph
 * @route   DELETE /api/graph/:id
 * @access  Public
 */
export const deleteGraph = asyncHandler(async (req: Request, res: Response) => {
  const result = await graphService.deleteGraph(req.params.id);
  if (!result) {
    throw new AppError("Graph not found", 404);
  }
  res.status(200).json({ success: true });
});
