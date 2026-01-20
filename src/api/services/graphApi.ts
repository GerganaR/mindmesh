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

// Save graph
export const saveGraph = async (
  params: SaveGraphParams
): Promise<Graph | null> => {
  const { title, nodes, edges, nodeCount, lastModified, created } = params;
  try {
    const response = await apiClient.post<Graph>(ENDPOINTS.graphs, {
      title,
      nodes,
      edges,
      nodeCount,
      lastModified,
      created,
    });
    return response.data;
  } catch (error) {
    console.error("❌ API: Failed to save/update mind map:", error);
    return null;
  }
};

// Update graph
export const updateGraph = async (
  params: SaveGraphParams
): Promise<Graph | null> => {
  const { id, title, nodes, edges, nodeCount, lastModified, created } = params;
  if (!id) {
    throw new Error("ID is required for updating a graph");
  }

  try {
    const response = await apiClient.put<{ success: boolean; graph: Graph }>(
      ENDPOINTS.graphs + "/" + id,
      {
        title,
        nodes,
        edges,
        nodeCount,
        lastModified,
        created,
      }
    );
    return response.data.graph;
  } catch (error) {
    console.error("❌ API: Failed to update graph:", error);
    return null;
  }
};

// Delete graphs
export const deleteGraph = async (
  id: string
): Promise<{ success: boolean }> => {
  try {
    const response = await apiClient.delete<{ success: boolean }>(
      ENDPOINTS.graphById(id)
    );
    return response.data;
  } catch (error) {
    console.error("Failed to delete graph:", error);
    return { success: false };
  }
};
