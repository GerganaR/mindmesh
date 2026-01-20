import mongoose from "mongoose";
import { IGraphPayload } from "../models/Graph";
import Graph from "../models/Graph";

/**
 * Fetches all graphs from the database
 */
export const getAllGraphs = async () => {
  return await Graph.find().sort({ lastModified: -1 });
};

/**
 * Fetches a specific graph by ID
 */
export const getGraphById = async (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return null;
  }
  return await Graph.findById(id);
};

/**
 * Creates a new graph
 */
export const createGraph = async (data: IGraphPayload) => {
  const graph = await Graph.create(data);
  return graph;
};

/**
 * Updates a specific graph by ID
 */
export const updateGraph = async (id: string, data: IGraphPayload) => {
  const graph = await Graph.findByIdAndUpdate(
    id,
    { ...data },
    { new: true, runValidators: true },
  );
  return graph;
};

/**
 * Deletes a specific graph by ID
 */
export const deleteGraph = async (id: string) => {
  const result = await Graph.findByIdAndDelete(id);
  return result;
};
