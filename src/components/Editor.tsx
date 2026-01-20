import { useCallback, useState, useRef } from "react";
import {
  ReactFlow,
  type NodeChange,
  type EdgeChange,
  type Connection,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  Background,
  BackgroundVariant,
  Controls,
  type ReactFlowInstance,
} from "reactflow";
import "reactflow/dist/style.css";
import type { NodeType } from "./Node";
import BaseNode from "./Node";
import Sidebar from "./Sidebar";
import type { Graph } from "../types/graph";
import { useParams } from "react-router-dom";
import { useCreateGraph, useUpdateGraph } from "../api/hooks/useGraphs";

export interface Node {
  id: string;
  type?: string;
  position: { x: number; y: number };
  data: {
    label: string;
    description?: string;
    type?: NodeType;
  };
}

export interface Edge {
  id: string;
  source: string;
  target: string;
}

const nodeTypes = {
  custom: BaseNode,
};

interface EditorProps {
  graph?: Graph | null;
}

const Editor: React.FC<EditorProps> = ({ graph }) => {
  const { id } = useParams();
  const [nodes, setNodes] = useState<Node[]>(graph?.nodes || []);
  const [edges, setEdges] = useState<Edge[]>(graph?.edges || []);
  const [title, setTitle] = useState<string>(
    graph?.title || "Untitled Mind Map"
  );

  // React Query mutations
  const createGraphMutation = useCreateGraph();
  const updateGraphMutation = useUpdateGraph();

  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] =
    useState<ReactFlowInstance | null>(null);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) =>
      setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    []
  );
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) =>
      setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    []
  );
  const onConnect = useCallback(
    (params: Connection) =>
      setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    []
  );

  const addNode = useCallback((nodeType: string) => {
    const newNode: Node = {
      id: `n${Date.now()}`, // Use timestamp for unique IDs
      type: "custom",
      position: {
        x: Math.random() * 400 + 100,
        y: Math.random() * 300 + 100,
      },
      data: {
        label: `New ${nodeType.charAt(0).toUpperCase() + nodeType.slice(1)}`,
        description: `A ${nodeType} node`,
        type: nodeType as NodeType,
      },
    };
    setNodes((nds) => [...nds, newNode]);
  }, []);

  const saveGraphApi = useCallback(async () => {
    try {
      const graphData = {
        title,
        nodes,
        edges,
        nodeCount: nodes.length,
        lastModified: new Date().toISOString(),
        created: graph?.created || new Date().toISOString(),
      };

      if (id) {
        // Update existing graph
        await updateGraphMutation.mutateAsync({
          id,
          ...graphData,
        });
        console.log("✅ Graph updated successfully");
      } else {
        // Create new graph
        await createGraphMutation.mutateAsync(graphData);
        console.log("✅ Graph created successfully");
      }
    } catch (error) {
      console.error("💥 Editor: Error saving graph:", error);
    }
  }, [
    nodes,
    edges,
    title,
    id,
    graph?.created,
    createGraphMutation,
    updateGraphMutation,
  ]);

  const handleBack = useCallback(() => {
    // You can implement different back behaviors here:
    // Option 1: Go back in browser history
    window.history.back();

    // Option 2: Navigate to a specific route (if using React Router)
    // navigate('/dashboard');

    // Option 3: Reset to initial state
    // setNodes(initialNodes);
    // setEdges(initialEdges);

    // Option 4: Show confirmation and clear
    // if (window.confirm('Go back? Unsaved changes will be lost.')) {
    //   // Handle navigation
    // }
  }, []);

  const clearGraph = useCallback(() => {
    if (
      window.confirm(
        "Are you sure you want to clear all nodes and connections? This action cannot be undone."
      )
    ) {
      setNodes([]);
      setEdges([]);
    }
  }, []);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();
      const nodeType = event.dataTransfer.getData("application/reactflow");

      // Check if the dropped element is a valid node type
      if (typeof nodeType === "undefined" || !nodeType || !reactFlowBounds) {
        return;
      }

      // Calculate position relative to the canvas
      const position = reactFlowInstance?.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      }) || { x: 0, y: 0 };

      const newNode: Node = {
        id: `n${Date.now()}`,
        type: "custom",
        position,
        data: {
          label: `New ${nodeType.charAt(0).toUpperCase() + nodeType.slice(1)}`,
          description: `A ${nodeType} node`,
          type: nodeType as NodeType,
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance]
  );

  return (
    <div className="relative w-full h-full">
      <Sidebar
        onAddNode={addNode}
        onSave={saveGraphApi}
        onClear={clearGraph}
        onBack={handleBack}
        title={title}
        onTitleChange={setTitle}
      />
      <div className="w-full h-full" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onInit={setReactFlowInstance}
          onDrop={onDrop}
          onDragOver={onDragOver}
          fitView
        >
          <Background
            id="1"
            gap={20}
            color="#374151"
            variant={BackgroundVariant.Dots}
            style={{
              backgroundColor: "#111827",
              backgroundImage:
                "radial-gradient(circle at 1px 1px, rgba(99, 102, 241, 0.1) 1px, transparent 0)",
            }}
          />
          <Background
            id="2"
            gap={100}
            color="#4B5563"
            variant={BackgroundVariant.Lines}
            style={{ opacity: 0.3 }}
          />
          <Controls
            position="top-right"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              color: "#ffffff",
              borderRadius: "8px",
              padding: "15px",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              gap: "5px",
              flexDirection: "column",
              display: "flex",
            }}
          />
        </ReactFlow>
      </div>
    </div>
  );
};

export default Editor;
