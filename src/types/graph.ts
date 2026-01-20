import type { Edge, Node } from "reactflow";

export interface Graph {
  id: string;
  title: string;
  nodes: Node[];
  edges: Edge[];
  nodeCount: number;
  lastModified: string;
  created: string;
}