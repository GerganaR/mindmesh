import type { Edge, Node } from "reactflow";

export interface Graph {
  id: string;
  title: string;
  description?: string;
  nodes: Node[];
  edges: Edge[];
  nodeCount: number;
  lastModified: string;
  created: string;
}
