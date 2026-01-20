import React, { useState, useRef, useEffect } from "react";
import {
  type NodeProps,
  Handle,
  Position,
  useReactFlow,
  useStore,
} from "reactflow";
import {
  FiZap,
  FiSearch,
  FiLayout,
  FiCheckSquare,
  FiPenTool,
  FiTrendingUp,
  FiGitBranch,
  FiAlertCircle,
  FiFlag,
  FiEdit2,
  FiCheck,
  FiX,
  FiPlay,
  FiSquare,
} from "react-icons/fi";
import { twMerge } from "tailwind-merge";

export type NodeType =
  | "start"
  | "end"
  | "idea"
  | "research"
  | "architecture"
  | "task"
  | "design"
  | "enhancement"
  | "decision"
  | "bug"
  | "milestone";

interface BaseNodeData {
  type: NodeType;
  label: string;
  description?: string;
}

// Color configuration for each node type
const NODE_CONFIG: Record<
  NodeType,
  {
    color: string;
    bgGradient: string;
    icon: React.ReactNode;
    title: string;
  }
> = {
  start: {
    color: "#10B981",
    bgGradient:
      "linear-gradient(180deg, #10B981E6 10%, #10B98133 68%, #10B98100 100%)",
    icon: <FiPlay />,
    title: "Start",
  },
  end: {
    color: "#EF4444",
    bgGradient:
      "linear-gradient(180deg, #EF4444E6 10%, #EF444433 68%, #EF444400 100%)",
    icon: <FiSquare />,
    title: "End",
  },
  idea: {
    color: "#FFD700",
    bgGradient:
      "linear-gradient(180deg, #FFD700E6 10%, #FFD70033 68%, #FFD70000 100%)",
    icon: <FiZap />,
    title: "Idea",
  },
  research: {
    color: "#4A90E2",
    bgGradient:
      "linear-gradient(180deg, #4A90E2E6 10%, #4A90E233 68%, #4A90E200 100%)",
    icon: <FiSearch />,
    title: "Research",
  },
  architecture: {
    color: "#9013FE",
    bgGradient:
      "linear-gradient(180deg, #9013FEE6 10%, #9013FE33 68%, #9013FE00 100%)",
    icon: <FiLayout />,
    title: "Architecture",
  },
  task: {
    color: "#FF6B35",
    bgGradient:
      "linear-gradient(180deg, #FF6B35E6 10%, #FF6B3533 68%, #FF6B3500 100%)",
    icon: <FiCheckSquare />,
    title: "Task",
  },
  design: {
    color: "#E91E63",
    bgGradient:
      "linear-gradient(180deg, #E91E63E6 10%, #E91E6333 68%, #E91E6300 100%)",
    icon: <FiPenTool />,
    title: "Design",
  },
  enhancement: {
    color: "#00C853",
    bgGradient:
      "linear-gradient(180deg, #00C853E6 10%, #00C85333 68%, #00C85300 100%)",
    icon: <FiTrendingUp />,
    title: "Enhancement",
  },
  decision: {
    color: "#FF9800",
    bgGradient:
      "linear-gradient(180deg, #FF9800E6 10%, #FF980033 68%, #FF980000 100%)",
    icon: <FiGitBranch />,
    title: "Decision",
  },
  bug: {
    color: "#F44336",
    bgGradient:
      "linear-gradient(180deg, #F44336E6 10%, #F4433633 68%, #F4433600 100%)",
    icon: <FiAlertCircle />,
    title: "Bug",
  },
  milestone: {
    color: "#673AB7",
    bgGradient:
      "linear-gradient(180deg, #673AB7E6 10%, #673AB733 68%, #673AB700 100%)",
    icon: <FiFlag />,
    title: "Milestone",
  },
};

const BaseNode: React.FC<NodeProps<BaseNodeData>> = (props) => {
  const { data, selected, id } = props;
  const config = NODE_CONFIG[data.type];
  const { setNodes } = useReactFlow();

  // Get edges to determine if handles are connected
  const edges = useStore((store) => store.edges);
  const hasInputConnection = edges.some((edge) => edge.target === id);
  const hasOutputConnection = edges.some((edge) => edge.source === id);

  const [isEditing, setIsEditing] = useState(false);
  const [editLabel, setEditLabel] = useState(data.label);
  const [editDescription, setEditDescription] = useState(
    data.description || ""
  );

  const labelInputRef = useRef<HTMLInputElement>(null);
  const descriptionInputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditing && labelInputRef.current) {
      labelInputRef.current.focus();
      labelInputRef.current.select();
    }
  }, [isEditing]);

  const handleSave = () => {
    setNodes((nodes) =>
      nodes.map((node) =>
        node.id === id
          ? {
              ...node,
              data: {
                ...node.data,
                label: editLabel.trim() || data.label,
                description: editDescription.trim(),
              },
            }
          : node
      )
    );
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditLabel(data.label);
    setEditDescription(data.description || "");
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    } else if (e.key === "Escape") {
      e.preventDefault();
      handleCancel();
    }
  };

  // Determine which handles to show based on node type
  const showInputHandle = data.type !== "start";
  const showOutputHandle = data.type !== "end";

  // Handle styles - filled when connected, hollow when not
  const getHandleStyle = (isConnected: boolean) => ({
    background: isConnected ? config.color : "transparent",
    width: 12,
    height: 12,
    border: `2px solid ${config.color}`,
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  });

  return (
    <div
      className={twMerge(
        "flex flex-col w-[250px] relative bg-[#1E293B] rounded-lg",
        selected && "box-shadow-lg"
      )}
      style={{
        backgroundImage: config.bgGradient,
      }}
    >
      {/* Input Handle - only show for non-start nodes */}
      {showInputHandle && (
        <Handle
          type="target"
          position={Position.Left}
          style={getHandleStyle(hasInputConnection)}
        />
      )}

      {/* Header */}
      <div className="flex items-center gap-2 p-3 border-b border-white/20">
        <div
          className="flex items-center justify-center w-8 h-8 rounded-full text-white text-lg"
          style={{ backgroundColor: config.color }}
        >
          {config.icon}
        </div>
        <div className="flex-1">
          <div className="font-semibold text-white text-sm">{config.title}</div>
        </div>
        <div className="flex items-center gap-1">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="p-1 text-green-400 hover:text-green-300 transition-colors"
                title="Save changes"
              >
                <FiCheck size={14} />
              </button>
              <button
                onClick={handleCancel}
                className="p-1 text-red-400 hover:text-red-300 transition-colors"
                title="Cancel editing"
              >
                <FiX size={14} />
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="p-1 text-gray-400 hover:text-white transition-colors"
              title="Edit node"
            >
              <FiEdit2 size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="px-8 py-4 flex-1">
        {isEditing ? (
          <div className="space-y-2">
            <input
              ref={labelInputRef}
              value={editLabel}
              onChange={(e) => setEditLabel(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full bg-white/10 text-white text-sm font-medium px-2 py-1 rounded border border-white/20 focus:border-white/40 focus:outline-none"
              placeholder="Node label"
            />
            <textarea
              ref={descriptionInputRef}
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full bg-white/10 text-gray-300 text-xs px-2 py-1 rounded border border-white/20 focus:border-white/40 focus:outline-none resize-none"
              placeholder="Node description (optional)"
              rows={3}
            />
          </div>
        ) : (
          <>
            <div
              className="font-medium text-white text-sm mb-1 cursor-pointer hover:text-gray-200 transition-colors"
              onDoubleClick={() => setIsEditing(true)}
              title="Double-click to edit"
            >
              {data.label}
            </div>
            {data.description && (
              <div
                className="text-xs text-gray-300 leading-tight cursor-pointer hover:text-gray-200 transition-colors"
                onDoubleClick={() => setIsEditing(true)}
                title="Double-click to edit"
              >
                {data.description}
              </div>
            )}
            {!data.description && !isEditing && (
              <div
                className="text-xs text-gray-500 italic cursor-pointer hover:text-gray-400 transition-colors"
                onDoubleClick={() => setIsEditing(true)}
                title="Double-click to add description"
              >
                Click to add description...
              </div>
            )}
          </>
        )}
      </div>

      {/* Output Handle - only show for non-end nodes */}
      {showOutputHandle && (
        <Handle
          type="source"
          position={Position.Right}
          style={getHandleStyle(hasOutputConnection)}
        />
      )}
    </div>
  );
};

BaseNode.displayName = "CustomNode";

export default BaseNode;
