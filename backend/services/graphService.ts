import Graph, {  IGraph, IGraphPayload } from "../models/Graph";

/**
 * Fetches all graphs from the database
 * @returns - The graphs array
 * @throws - An error if the mind maps cannot be fetched
 */
export const getAllGraphs = async (): Promise<IGraph[]> => {
  try {
    return await Graph.find();
  } catch (error) {
    console.error("Error fetching graphs:", error);
    throw new Error("Failed to fetch graphs");
  }
};

/**
 * Fetches a specific mind map by ID from the database
 * @param id - The mind map ID
 * @returns - The mind map or null if not found
 * @throws - An error if the mind map cannot be fetched
 */
export const getGraphById = async (id: string): Promise<IGraph | null> => {
  try {
    return await Graph.findOne({ id });
  } catch (error) {
    console.error("Error fetching graph:", error);
    throw new Error("Failed to fetch graph");
  }
};

export const saveGraph = async (
  id: string | undefined,
  data: IGraphPayload
): Promise<IGraph> => {
  try {
    const { title, nodes, edges, nodeCount, lastModified, created } = data;

    let graph: IGraph | null = null;

    if (id) {
      // Update existing graph
      graph = await Graph.findOne({ id });
    }

    if (!graph) {
      // Create new graph
      graph = new Graph({
        title,
        nodes,
        edges,
        nodeCount,
        lastModified,
        created,
      });
    } else {
      // Update existing graph
      graph.title = title;
      graph.nodes = nodes;
      graph.edges = edges;
      graph.nodeCount = nodeCount;
      graph.lastModified = lastModified;
    }

    return await graph.save();
  } catch (error) {
    console.error("Error saving graph:", error);
    throw new Error("Failed to save graph");
  }
};

/**
 * Updates a specific graph in the database
 * @param id - The graph ID
 * @param data - The graph data to update
 * @returns - The updated mind map
 * @throws - An error if the graph cannot be updated
 */
export const updateGraph = async (
  id: string,
  data: IGraphPayload
): Promise<IGraph> => {
  try {
    const { title, nodes, edges, nodeCount, lastModified } = data;

    // Find existing graph
    const existingGraph = await Graph.findOne({ id });
    if (!existingGraph) {
      throw new Error("Graph not found");
    }

    // Update the graph
    existingGraph.title = title;
    existingGraph.nodes = nodes;
    existingGraph.edges = edges;
    existingGraph.nodeCount = nodeCount;
    existingGraph.lastModified = lastModified;
    // Keep the original creation date

    return await existingGraph.save();
  } catch (error) {
    console.error("Error updating graph:", error);
    throw new Error("Failed to update graph");
  }
};

/**
 * Deletes a specific graph from the database
 * @param id - The mind map ID
 * @returns - The response object
 * @throws - An error if the mind map cannot be deleted
 */
export const deleteGraph = async (id: string): Promise<void> => {
  try {
    const result = await Graph.deleteOne({ id });
    if (result.deletedCount === 0) {
      throw new Error("Graph not found");
    }
  } catch (error) {
    console.error("Error deleting mind map:", error);
    throw new Error("Failed to delete mind map");
  }
};