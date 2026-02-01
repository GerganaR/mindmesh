import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Graph } from "../../types/graph";
import {
  fetchAllGraphs,
  fetchGraphById,
  saveGraph,
  updateGraph,
  deleteGraph,
} from "../services/graphApi";

export const GRAPH_QUERY_KEYS = {
  all: ["graphs"] as const,
  lists: () => [...GRAPH_QUERY_KEYS.all, "list"] as const,
  list: (filters: string) =>
    [...GRAPH_QUERY_KEYS.lists(), { filters }] as const,
  details: () => [...GRAPH_QUERY_KEYS.all, "detail"] as const,
  detail: (id: string) => [...GRAPH_QUERY_KEYS.details(), id] as const,
} as const;

export const useGraphs = () => {
  return useQuery({
    queryKey: GRAPH_QUERY_KEYS.lists(),
    queryFn: fetchAllGraphs,
    staleTime: 5 * 60 * 1000,
  });
};

export const useGraph = (id: string | undefined) => {
  return useQuery({
    queryKey: GRAPH_QUERY_KEYS.detail(id!),
    queryFn: () => fetchGraphById(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateGraph = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: saveGraph,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: GRAPH_QUERY_KEYS.lists() });

      if (response.success && response.data) {
        queryClient.setQueryData(
          GRAPH_QUERY_KEYS.detail(response.data.id),
          response.data,
        );
      }
    },
    onError: (error) => {
      console.error("Failed to create graph:", error);
    },
  });
};

export const useUpdateGraph = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateGraph,
    onSuccess: (updatedGraph, variables) => {
      if (updatedGraph && variables.id) {
        queryClient.setQueryData(
          GRAPH_QUERY_KEYS.detail(variables.id),
          updatedGraph,
        );
      }

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
      queryClient.removeQueries({
        queryKey: GRAPH_QUERY_KEYS.detail(deletedId),
      });

      queryClient.setQueryData<Graph[]>(
        GRAPH_QUERY_KEYS.lists(),
        (oldData) => oldData?.filter((graph) => graph.id !== deletedId) || [],
      );
    },
    onError: (error) => {
      console.error("Failed to delete graph:", error);
    },
  });
};
