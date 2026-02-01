import { useCallback, useState, useRef, useEffect } from "react";
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
  type NodeMouseHandler,
  type EdgeMouseHandler,
} from "reactflow";
import { toast } from "react-hot-toast";

import "reactflow/dist/style.css";
import type { NodeType } from "./Node";
import BaseNode from "./Node";
import Sidebar from "./Sidebar";
import ContextMenu from "./ContextMenu";
import EdgeContextMenu from "./EdgeContextMenu";
import type { Graph } from "../types/graph";
import { useParams, useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  const [nodes, setNodes] = useState<Node[]>(graph?.nodes || []);
  const [edges, setEdges] = useState<Edge[]>(graph?.edges || []);
  const [title, setTitle] = useState<string>(
    graph?.title || "Untitled Mind Map",
  );
  const [description, setDescription] = useState<string>(
    graph?.description || "",
  );
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const initialStateRef = useRef<string | null>(null);
  const lastSavedStateRef = useRef<string | null>(null);

  // Track current state for unsaved changes detection
  const getCurrentState = useCallback(() => {
    // Sanitize nodes to remove React Flow specific internal state
    const cleanNodes = nodes.map(({ id, type, position, data }) => ({
      id,
      type,
      position: { x: Math.round(position.x), y: Math.round(position.y) }, // Round positions to avoid float diffs
      data,
    }));

    // Sanitize edges
    const cleanEdges = edges.map(({ id, source, target }) => ({
      id,
      source,
      target,
    }));

    return JSON.stringify({
      nodes: cleanNodes,
      edges: cleanEdges,
      title,
      description,
    });
  }, [nodes, edges, title, description]);

  // Initialize saved state on mount
  useEffect(() => {
    if (initialStateRef.current === null && nodes.length > 0) {
      const state = getCurrentState();
      initialStateRef.current = state;
      lastSavedStateRef.current = state;
    }
  }, [getCurrentState, nodes.length]);

  // Check for unsaved changes
  useEffect(() => {
    if (lastSavedStateRef.current === null) return;
    const currentState = getCurrentState();
    setHasUnsavedChanges(currentState !== lastSavedStateRef.current);
  }, [getCurrentState]);

  // Warn before browser close/refresh
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedChanges]);

  // Sync state with graph prop
  useEffect(() => {
    if (graph) {
      setNodes(graph.nodes || []);
      setEdges(graph.edges || []);
      setTitle(graph.title || "Untitled Mind Map");
      setDescription(graph.description || "");

      // We need to wait for the next render cycle for the state
      // to update so getCurrentState() uses the new values.
      // However, we can construct the string from the props directly here.
      const cleanNodes = (graph.nodes || []).map(
        ({ id, type, position, data }) => ({
          id,
          type,
          position: { x: Math.round(position.x), y: Math.round(position.y) },
          data,
        }),
      );

      const cleanEdges = (graph.edges || []).map(({ id, source, target }) => ({
        id,
        source,
        target,
      }));

      const state = JSON.stringify({
        nodes: cleanNodes,
        edges: cleanEdges,
        title: graph.title || "Untitled Mind Map",
        description: graph.description || "",
      });
      initialStateRef.current = state;
      lastSavedStateRef.current = state;
      setHasUnsavedChanges(false);
    }
  }, [graph]);

  // React Query mutations
  const createGraphMutation = useCreateGraph();
  const updateGraphMutation = useUpdateGraph();

  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] =
    useState<ReactFlowInstance | null>(null);

  // Node context menu state
  const [contextMenu, setContextMenu] = useState<{
    id: string;
    top: number;
    left: number;
  } | null>(null);

  // Edge context menu state
  const [edgeContextMenu, setEdgeContextMenu] = useState<{
    id: string;
    top: number;
    left: number;
  } | null>(null);

  const handleCloseContextMenu = useCallback(() => setContextMenu(null), []);
  const handleCloseEdgeContextMenu = useCallback(
    () => setEdgeContextMenu(null),
    [],
  );

  // Close context menus when clicking elsewhere
  const handlePaneClick = useCallback(() => {
    setContextMenu(null);
    setEdgeContextMenu(null);
  }, []);

  const onNodeContextMenu: NodeMouseHandler = useCallback(
    (event, node) => {
      event.preventDefault();
      setEdgeContextMenu(null);

      const containerBounds = reactFlowWrapper.current?.getBoundingClientRect();

      if (containerBounds) {
        setContextMenu({
          id: node.id,
          top: event.clientY - containerBounds.top,
          left: event.clientX - containerBounds.left,
        });
      }
    },
    [setContextMenu],
  );

  const onEdgeContextMenu: EdgeMouseHandler = useCallback(
    (event, edge) => {
      event.preventDefault();
      setContextMenu(null);

      const containerBounds = reactFlowWrapper.current?.getBoundingClientRect();

      if (containerBounds) {
        setEdgeContextMenu({
          id: edge.id,
          top: event.clientY - containerBounds.top,
          left: event.clientX - containerBounds.left,
        });
      }
    },
    [setEdgeContextMenu],
  );

  const deleteNode = useCallback(
    (nodeId: string) => {
      setNodes((nodes) => nodes.filter((node) => node.id !== nodeId));
      setEdges((edges) =>
        edges.filter(
          (edge) => edge.source !== nodeId && edge.target !== nodeId,
        ),
      );
      setContextMenu(null);
    },
    [setNodes, setEdges],
  );

  const deleteEdge = useCallback(
    (edgeId: string) => {
      setEdges((edges) => edges.filter((edge) => edge.id !== edgeId));
      setEdgeContextMenu(null);
    },
    [setEdges],
  );

  const onNodesChange = useCallback(
    (changes: NodeChange[]) =>
      setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    [],
  );
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) =>
      setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    [],
  );
  const onConnect = useCallback(
    (params: Connection) =>
      setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    [],
  );

  const addNode = useCallback((nodeType: string) => {
    const newNode: Node = {
      id: `n${Date.now()}`,
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

  // Save graph function
  const saveGraph = useCallback(async () => {
    if (isSaving) return;

    // Validation
    if (nodes.length === 0) {
      toast.error(
        "Cannot save an empty mind map. Please add at least one node.",
      );
      return;
    }

    if (!title.trim() || title.trim() === "Untitled Mind Map") {
      toast.error("Please provide a valid title for your mind map.");
      return;
    }

    setIsSaving(true);
    try {
      const graphData = {
        id: id || undefined,
        title,
        description,
        nodes,
        edges,
        nodeCount: nodes.length,
        lastModified: new Date().toISOString(),
        created: graph?.created || new Date().toISOString(),
      };

      if (id) {
        // Update existing graph
        const updatedGraph = await updateGraphMutation.mutateAsync(graphData);
        if (updatedGraph) {
          toast.success("Graph saved successfully");
          lastSavedStateRef.current = getCurrentState();
          setHasUnsavedChanges(false);
        } else {
          toast.error("Failed to save graph");
        }
      } else {
        // Create new graph
        const result = await createGraphMutation.mutateAsync(graphData);
        if (result.success && result.data) {
          const newGraph = result.data;
          if (newGraph && newGraph.id) {
            toast.success("Graph created successfully");
            lastSavedStateRef.current = getCurrentState();
            setHasUnsavedChanges(false);
            navigate(`/${newGraph.id}`, { replace: true });
          }
        } else {
          const errorMessage = result.error?.message || "Failed to save graph";
          toast.error(errorMessage);
        }
      }
    } catch (error) {
      console.error("💥 Editor: Error saving graph:", error);
      toast.error("Failed to save graph");
    } finally {
      setIsSaving(false);
    }
  }, [
    nodes,
    edges,
    title,
    description,
    id,
    graph?.created,
    createGraphMutation,
    updateGraphMutation,
    navigate,
    isSaving,
    getCurrentState,
  ]);

  // Navigate back with confirmation if there are unsaved changes
  const handleBack = useCallback(() => {
    if (hasUnsavedChanges) {
      const confirmLeave = window.confirm(
        "You have unsaved changes. Are you sure you want to leave?",
      );
      if (!confirmLeave) return;
    }
    navigate("/");
  }, [navigate, hasUnsavedChanges]);

  const clearGraph = useCallback(() => {
    if (
      window.confirm(
        "Are you sure you want to clear all nodes and connections? This action cannot be undone.",
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

      if (typeof nodeType === "undefined" || !nodeType || !reactFlowBounds) {
        return;
      }

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
    [reactFlowInstance],
  );

  return (
    <div className="relative w-full h-full">
      <Sidebar
        onAddNode={addNode}
        onSave={saveGraph}
        onClear={clearGraph}
        onBack={handleBack}
        title={title}
        onTitleChange={setTitle}
        description={description}
        onDescriptionChange={setDescription}
        isSaving={isSaving}
        hasUnsavedChanges={hasUnsavedChanges}
      />
      <div className="w-full h-full relative" ref={reactFlowWrapper}>
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
          onNodeContextMenu={onNodeContextMenu}
          onEdgeContextMenu={onEdgeContextMenu}
          onPaneClick={handlePaneClick}
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
        {contextMenu && (
          <ContextMenu
            x={contextMenu.left}
            y={contextMenu.top}
            onDelete={() => deleteNode(contextMenu.id)}
            onClose={handleCloseContextMenu}
          />
        )}
        {edgeContextMenu && (
          <EdgeContextMenu
            x={edgeContextMenu.left}
            y={edgeContextMenu.top}
            onDelete={() => deleteEdge(edgeContextMenu.id)}
            onClose={handleCloseEdgeContextMenu}
          />
        )}
      </div>
    </div>
  );
};

export default Editor;
