import mongoose, { Schema, Document } from "mongoose";

// Node and Edge interfaces
export interface INode {
  id: string;
  position: { x: number; y: number };
  data: {
    label: string;
    description?: string;
    type?: string;
  };
  type?: string;
}

export interface IEdge {
  id: string;
  source: string;
  target: string;
}

// Graph document interface
export interface IGraph extends Document {
  id: string;
  title: string;
  nodes: INode[];
  edges: IEdge[];
  nodeCount: number;
  lastModified: string;
  created: string;
}

export interface IGraphPayload {
  id?: string;
  title: string;
  nodes: INode[];
  edges: IEdge[];
  nodeCount: number;
  lastModified: string;
  created: string;
}

const NodeSchema: Schema = new Schema({
  id: { type: String, required: true },
  position: {
    x: { type: Number, required: true },
    y: { type: Number, required: true },
  },
  data: {
    label: { type: String, required: true },
    description: { type: String },
    type: { type: String },
  },
  type: { type: String },
});

const EdgeSchema: Schema = new Schema({
  id: { type: String, required: true },
  source: { type: String, required: true },
  target: { type: String, required: true },
});

const GraphSchema: Schema = new Schema(
  {
    id: { type: String, required: true, unique: true, default: () => `graph_${Date.now()}` },
    title: { type: String, required: true },
    nodes: { type: [NodeSchema], default: [] },
    edges: { type: [EdgeSchema], default: [] },
    nodeCount: { type: Number, default: 0 },
    lastModified: { type: String, required: true },
    created: { type: String, required: true },
  },
  {
    collection: "graphs",
  }
);

// Export model
const Graph = mongoose.model<IGraph>("Graph", GraphSchema);
export default Graph;
