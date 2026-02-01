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
  FiPlay,
  FiSquare,
  FiPlus,
  FiSave,
  FiTrash2,
  FiChevronLeft,
  FiChevronRight,
  FiMenu,
  FiEdit2,
  FiArrowLeft,
  FiLoader,
  FiCheck,
} from "react-icons/fi";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SidebarProps {
  onAddNode: (nodeType: string) => void;
  onSave: () => void;
  onClear: () => void;
  onBack?: () => void;
  title?: string;
  onTitleChange?: (title: string) => void;
  description?: string;
  onDescriptionChange?: (desc: string) => void;
  isSaving?: boolean;
  hasUnsavedChanges?: boolean;
}

// Node type configuration with colors and icons
const NODE_TYPES = [
  {
    type: "start",
    label: "Start",
    icon: <FiPlay />,
    color: "#10B981",
    bgColor: "bg-emerald-500/20",
    hoverColor: "hover:bg-emerald-500/30",
    borderColor: "border-emerald-500/40",
  },
  {
    type: "idea",
    label: "Idea",
    icon: <FiZap />,
    color: "#FFD700",
    bgColor: "bg-yellow-500/20",
    hoverColor: "hover:bg-yellow-500/30",
    borderColor: "border-yellow-500/40",
  },
  {
    type: "research",
    label: "Research",
    icon: <FiSearch />,
    color: "#4A90E2",
    bgColor: "bg-blue-500/20",
    hoverColor: "hover:bg-blue-500/30",
    borderColor: "border-blue-500/40",
  },
  {
    type: "architecture",
    label: "Architecture",
    icon: <FiLayout />,
    color: "#9013FE",
    bgColor: "bg-purple-500/20",
    hoverColor: "hover:bg-purple-500/30",
    borderColor: "border-purple-500/40",
  },
  {
    type: "task",
    label: "Task",
    icon: <FiCheckSquare />,
    color: "#FF6B35",
    bgColor: "bg-orange-500/20",
    hoverColor: "hover:bg-orange-500/30",
    borderColor: "border-orange-500/40",
  },
  {
    type: "design",
    label: "Design",
    icon: <FiPenTool />,
    color: "#E91E63",
    bgColor: "bg-pink-500/20",
    hoverColor: "hover:bg-pink-500/30",
    borderColor: "border-pink-500/40",
  },
  {
    type: "enhancement",
    label: "Enhancement",
    icon: <FiTrendingUp />,
    color: "#00C853",
    bgColor: "bg-green-500/20",
    hoverColor: "hover:bg-green-500/30",
    borderColor: "border-green-500/40",
  },
  {
    type: "decision",
    label: "Decision",
    icon: <FiGitBranch />,
    color: "#FF9800",
    bgColor: "bg-amber-500/20",
    hoverColor: "hover:bg-amber-500/30",
    borderColor: "border-amber-500/40",
  },
  {
    type: "bug",
    label: "Bug",
    icon: <FiAlertCircle />,
    color: "#F44336",
    bgColor: "bg-red-500/20",
    hoverColor: "hover:bg-red-500/30",
    borderColor: "border-red-500/40",
  },
  {
    type: "milestone",
    label: "Milestone",
    icon: <FiFlag />,
    color: "#673AB7",
    bgColor: "bg-violet-500/20",
    hoverColor: "hover:bg-violet-500/30",
    borderColor: "border-violet-500/40",
  },
  {
    type: "end",
    label: "End",
    icon: <FiSquare />,
    color: "#EF4444",
    bgColor: "bg-red-500/20",
    hoverColor: "hover:bg-red-500/30",
    borderColor: "border-red-500/40",
  },
];

const Sidebar = ({
  onAddNode,
  onSave,
  onClear,
  onBack,
  title,
  onTitleChange,
  description,
  onDescriptionChange,
  isSaving,
  hasUnsavedChanges,
}: SidebarProps) => {
  const [isOpen, setIsOpen] = useState(true);

  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Sidebar */}
      <motion.div
        className="fixed top-0 left-0 z-20 h-screen bg-gray-900/95 backdrop-blur-md border-r border-gray-700/50 shadow-2xl overflow-hidden"
        initial={{ width: 320 }}
        animate={{ width: isOpen ? 320 : 0 }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
        }}
      >
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="flex flex-col h-full p-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
              }}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-700/50 flex-shrink-0">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 bg-indigo-500/20 rounded-xl">
                    <FiMenu className="text-indigo-400" size={20} />
                  </div>
                  <div>
                    <h2 className="text-white font-bold text-lg">MindMesh</h2>
                    <p className="text-gray-400 text-sm">Mind Mapping Tool</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {onBack && (
                    <motion.button
                      onClick={onBack}
                      className="p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 text-gray-400 hover:text-white transition-all duration-200"
                      title="Go back"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FiArrowLeft size={18} />
                    </motion.button>
                  )}
                  <motion.button
                    onClick={toggleSidebar}
                    className="p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 text-gray-400 hover:text-white transition-all duration-200"
                    title="Close sidebar"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FiChevronLeft size={18} />
                  </motion.button>
                </div>
              </div>

              {/* Scrollable Content Area */}
              <div className="flex-1 overflow-y-auto px-2">
                {/* Editable Title */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-indigo-500/20 rounded-lg">
                      <FiEdit2 className="text-indigo-400" size={16} />
                    </div>
                    <h3 className="text-white font-semibold text-sm">
                      Mind Map Details
                    </h3>
                  </div>
                  <div className="space-y-2">
                    <input
                      type="text"
                      className="w-full bg-white/10 text-white font-medium text-base px-4 py-3 rounded-xl border border-white/20 focus:border-indigo-400/60 focus:bg-white/15 focus:outline-none transition-all duration-200 placeholder-gray-400"
                      placeholder="Enter title..."
                      defaultValue={title}
                      onChange={(e) => onTitleChange?.(e.target.value)}
                    />
                    <textarea
                      className="w-full bg-white/10 text-gray-300 text-sm px-4 py-3 rounded-xl border border-white/20 focus:border-indigo-400/60 focus:bg-white/15 focus:outline-none transition-all duration-200 placeholder-gray-400 resize-none h-24"
                      placeholder="Enter description (optional)..."
                      defaultValue={description}
                      onChange={(e) => onDescriptionChange?.(e.target.value)}
                    />
                  </div>
                </div>
                {/* Add Node Section */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center justify-center w-8 h-8 bg-indigo-500/20 rounded-lg">
                      <FiPlus className="text-indigo-400" size={16} />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold text-sm">
                        Add Nodes
                      </h3>
                      <p className="text-gray-400 text-xs">
                        Click or drag to add
                      </p>
                    </div>
                  </div>

                  {/* Node Type Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    {NODE_TYPES.map((nodeType, index) => (
                      <motion.div
                        key={nodeType.type}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <button
                          onClick={() => onAddNode(nodeType.type)}
                          onDragStart={(
                            event: React.DragEvent<HTMLButtonElement>,
                          ) => onDragStart(event, nodeType.type)}
                          draggable
                          className={`
                            group relative flex flex-col items-center justify-center w-full
                            p-3 rounded-xl border cursor-grab active:cursor-grabbing
                            ${nodeType.bgColor} ${nodeType.hoverColor} ${nodeType.borderColor}
                            focus:outline-none focus:ring-2 focus:ring-white/20
                          `}
                          title={`Click or drag to add ${nodeType.label} node`}
                        >
                          {/* Icon */}
                          <div
                            className="flex items-center justify-center w-8 h-8 rounded-lg mb-2 transition-transform group-hover:scale-110"
                            style={{
                              backgroundColor: `${nodeType.color}20`,
                              color: nodeType.color,
                            }}
                          >
                            <span style={{ fontSize: "16px" }}>
                              {nodeType.icon}
                            </span>
                          </div>

                          {/* Label */}
                          <span className="text-white text-xs font-medium text-center leading-tight">
                            {nodeType.label}
                          </span>

                          {/* Hover glow effect */}
                          <div
                            className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-200"
                            style={{
                              background: `radial-gradient(circle at center, ${nodeType.color}, transparent 70%)`,
                            }}
                          />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Actions Section */}
                <div className="mb-6 px-2">
                  <h3 className="text-white font-semibold text-sm mb-3">
                    Actions
                  </h3>
                  <div className="space-y-3">
                    <motion.button
                      onClick={onSave}
                      disabled={isSaving}
                      className={`w-full flex items-center gap-3 p-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-white/20 ${
                        isSaving
                          ? "border-gray-500/40 bg-gray-500/20 cursor-not-allowed"
                          : "border-green-500/40 bg-green-500/20 hover:bg-green-500/30"
                      }`}
                      title="Save mind map"
                      whileHover={isSaving ? {} : { scale: 1.02 }}
                      whileTap={isSaving ? {} : { scale: 0.98 }}
                    >
                      {isSaving ? (
                        <FiLoader
                          className="text-gray-400 animate-spin"
                          size={18}
                        />
                      ) : hasUnsavedChanges ? (
                        <FiSave className="text-green-400" size={18} />
                      ) : (
                        <FiCheck className="text-green-400" size={18} />
                      )}
                      <span
                        className={
                          isSaving ? "text-gray-400" : "text-green-400"
                        }
                        style={{ fontWeight: 500 }}
                      >
                        {isSaving
                          ? "Saving..."
                          : hasUnsavedChanges
                            ? "Save Mind Map"
                            : "Saved"}
                      </span>
                      {hasUnsavedChanges && !isSaving && (
                        <span className="ml-auto w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                      )}
                    </motion.button>

                    <motion.button
                      onClick={onClear}
                      className="w-full flex items-center gap-3 p-3 rounded-xl border border-red-500/40 bg-red-500/20 hover:bg-red-500/30 focus:outline-none focus:ring-2 focus:ring-white/20"
                      title="Clear mind map"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <FiTrash2 className="text-red-400" size={18} />
                      <span className="text-red-400 font-medium">
                        Clear All
                      </span>
                    </motion.button>
                  </div>
                </div>
              </div>

              {/* Footer tip - Fixed at bottom */}
              <div className="pt-4 border-t border-gray-700/50 flex-shrink-0">
                <p className="text-gray-500 text-xs text-center">
                  Click to add • Drag to position • Connect nodes by dragging
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Collapse/Expand Button - Always visible */}
      <AnimatePresence>
        {!isOpen && (
          <div className="fixed top-4 left-4 z-30 flex flex-col gap-2">
            {onBack && (
              <motion.button
                onClick={onBack}
                className="p-3 rounded-xl bg-gray-900/95 backdrop-blur-md border border-gray-700/50 text-gray-400 hover:text-white hover:bg-gray-800/95 shadow-2xl"
                title="Go back"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiArrowLeft size={20} />
              </motion.button>
            )}
            <motion.button
              onClick={toggleSidebar}
              className="p-3 rounded-xl bg-gray-900/95 backdrop-blur-md border border-gray-700/50 text-gray-400 hover:text-white hover:bg-gray-800/95 shadow-2xl"
              title="Open sidebar"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiChevronRight size={20} />
            </motion.button>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
