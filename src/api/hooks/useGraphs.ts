import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Graph } from "../../types/graph";
import {
  fetchAllGraphs,
  fetchGraphById,
  saveGraph,
  updateGraph,
  deleteGraph,
} from "../services/graphApi";

// Query keys
export const GRAPH_QUERY_KEYS = {
  all: ["graphs"] as const,
  lists: () => [...GRAPH_QUERY_KEYS.all, "list"] as const,
  list: (filters: string) =>
    [...GRAPH_QUERY_KEYS.lists(), { filters }] as const,
  details: () => [...GRAPH_QUERY_KEYS.all, "detail"] as const,
  detail: (id: string) => [...GRAPH_QUERY_KEYS.details(), id] as const,
} as const;

// Hook to fetch all graphs
export const useGraphs = () => {
  return useQuery({
    queryKey: GRAPH_QUERY_KEYS.lists(),
    queryFn: fetchAllGraphs,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook to fetch a specific graph
export const useGraph = (id: string | undefined) => {
  return useQuery({
    queryKey: GRAPH_QUERY_KEYS.detail(id!),
    queryFn: () => fetchGraphById(id!),
    enabled: !!id, // Only run query if id exists
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook to create a new graph
export const useCreateGraph = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: saveGraph,
    onSuccess: (newGraph) => {
      // Invalidate and refetch graphs list
      queryClient.invalidateQueries({ queryKey: GRAPH_QUERY_KEYS.lists() });

      // Add the new graph to cache
      if (newGraph) {
        queryClient.setQueryData(
          GRAPH_QUERY_KEYS.detail(newGraph.id),
          newGraph
        );
      }
    },
    onError: (error) => {
      console.error("Failed to create graph:", error);
    },
  });
};

// Hook to update an existing graph
export const useUpdateGraph = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateGraph,
    onSuccess: (updatedGraph, variables) => {
      // Update the specific graph in cache
      if (updatedGraph && variables.id) {
        queryClient.setQueryData(
          GRAPH_QUERY_KEYS.detail(variables.id),
          updatedGraph
        );
      }

      // Invalidate graphs list to reflect changes
      queryClient.invalidateQueries({ queryKey: GRAPH_QUERY_KEYS.lists() });
    },
    onError: (error) => {
      console.error("Failed to update graph:", error);
    },
  });
};

// Hook to delete a graph
export const useDeleteGraph = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteGraph,
    onSuccess: (_, deletedId) => {
      // Remove from cache
      queryClient.removeQueries({
        queryKey: GRAPH_QUERY_KEYS.detail(deletedId),
      });

      // Update graphs list cache
      queryClient.setQueryData<Graph[]>(
        GRAPH_QUERY_KEYS.lists(),
        (oldData) => oldData?.filter((graph) => graph.id !== deletedId) || []
      );
    },
    onError: (error) => {
      console.error("Failed to delete graph:", error);
    },
  });
};
