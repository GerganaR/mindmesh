import type { Node, Edge } from "reactflow";
import type { Graph } from "../../types/graph";
import { apiClient } from "../client/axios";

const ENDPOINTS = {
  graphs: "/graph",
  graphById: (id: string) => `/graph/${id}`,
} as const;

export type SaveGraphParams = {
  id?: string;
  title: string;
  description?: string;
  nodes: Node[];
  edges: Edge[];
  nodeCount: number;
  lastModified: string;
  created: string;
};

export const fetchGraphById = async (id: string): Promise<Graph | null> => {
  try {
    const response = await apiClient.get<Graph>(ENDPOINTS.graphById(id));
    return response.data;
  } catch (error) {
    console.error("❌ API: Failed to fetch graph:", error);
    return null;
  }
};

// Get all graphs
export const fetchAllGraphs = async (): Promise<Graph[]> => {
  try {
    const response = await apiClient.get<Graph[]>(ENDPOINTS.graphs);
    return response.data || [];
  } catch (error) {
    console.error("❌ API: Failed to fetch graphs:", error);
    return [];
  }
};

// Define API Response for Graph Operations
export interface GraphApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    status: number;
    message: string;
  };
}

// Save graph
export const saveGraph = async (
  params: SaveGraphParams,
): Promise<GraphApiResponse<Graph>> => {
  const { title, description, nodes, edges, nodeCount, lastModified, created } =
    params;
  try {
    const response = await apiClient.post<Graph>(ENDPOINTS.graphs, {
      title,
      description,
      nodes,
      edges,
      nodeCount,
      lastModified,
      created,
    });
    return { success: true, data: response.data };
  } catch (error: any) {
    console.error("❌ API: Failed to save mind map:", error);
    // Extract backend error message if available
    const status = error.response?.status || 500;
    const message =
      error.response?.data?.message || error.message || "Unknown error";
    return {
      success: false,
      error: { status, message },
    };
  }
};

// Update graph
export const updateGraph = async (
  params: SaveGraphParams,
): Promise<Graph | null> => {
  const {
    id,
    title,
    description,
    nodes,
    edges,
    nodeCount,
    lastModified,
    created,
  } = params;
  if (!id) {
    throw new Error("ID is required for updating a graph");
  }

  try {
    const response = await apiClient.put<Graph>(ENDPOINTS.graphById(id), {
      title,
      description,
      nodes,
      edges,
      nodeCount,
      lastModified,
      created,
    });
    return response.data;
  } catch (error) {
    console.error("❌ API: Failed to update graph:", error);
    return null;
  }
};

// Delete graphs
export const deleteGraph = async (
  id: string,
): Promise<{ success: boolean }> => {
  try {
    const response = await apiClient.delete<{ success: boolean }>(
      ENDPOINTS.graphById(id),
    );
    return response.data;
  } catch (error) {
    console.error("Failed to delete graph:", error);
    return { success: false };
  }
};
