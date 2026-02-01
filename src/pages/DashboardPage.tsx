import { useState, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiPlus,
  FiEdit3,
  FiTrash2,
  FiCalendar,
  FiSearch,
  FiX,
  FiGrid,
  FiAlertCircle,
  FiUpload,
} from "react-icons/fi";
import {
  useGraphs,
  useDeleteGraph,
  useCreateGraph,
} from "../api/hooks/useGraphs";
import type { Graph } from "../types/graph";
import DashboardSkeleton from "../components/DashboardSkeleton";
import { toast } from "react-hot-toast";
import HowToUse from "../components/HowToUse";

const Dashboard = () => {
  const { data: graphs = [], isLoading, error } = useGraphs();
  const deleteGraphMutation = useDeleteGraph();
  const createGraphMutation = useCreateGraph();
  const [searchQuery, setSearchQuery] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredGraphs = useMemo(() => {
    if (!searchQuery.trim()) return graphs;
    const query = searchQuery.toLowerCase();
    return graphs.filter(
      (graph) =>
        graph.title.toLowerCase().includes(query) ||
        (graph.nodeCount && graph.nodeCount.toString().includes(query)),
    );
  }, [graphs, searchQuery]);

  const deleteGraph = async (id: string, title: string) => {
    if (
      window.confirm(
        `Are you sure you want to delete "${title}"? This action cannot be undone.`,
      )
    ) {
      try {
        await deleteGraphMutation.mutateAsync(id);
        toast.success(`"${title}" deleted successfully`);
      } catch (error) {
        console.error("Error deleting graph:", error);
        toast.error("Failed to delete graph");
      }
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const content = e.target?.result as string;
        const template = JSON.parse(content);

        if (!template.nodes || !Array.isArray(template.nodes)) {
          throw new Error("Invalid template: missing nodes");
        }

        const newGraphData = {
          title: template.title || "Uploaded Template",
          description: template.explanation || template.description,
          nodes: template.nodes,
          edges: template.edges || [],
          nodeCount: template.nodes.length,
          lastModified: new Date().toISOString(),
          created: new Date().toISOString(),
        };

        const result = await createGraphMutation.mutateAsync(newGraphData);
        if (result.success) {
          toast.success("Template uploaded successfully!");
        } else {
          toast.error("Failed to load template");
        }
      } catch (error) {
        console.error("Error parsing template:", error);
        toast.error("Failed to upload template: " + (error as Error).message);
      }

      if (fileInputRef.current) fileInputRef.current.value = "";
    };
    reader.readAsText(file);
  };

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <FiAlertCircle className="text-red-400 text-6xl mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">
            Error Loading Graphs
          </h2>
          <p className="text-gray-400 mb-6">
            {error instanceof Error
              ? error.message
              : "Something went wrong. Please try again."}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors"
          >
            Retry
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
              <FiGrid className="text-indigo-400" />
              Mind Maps
            </h1>
            <p className="text-gray-400">
              Create and manage your visual knowledge graphs
            </p>
          </div>
          <div className="flex gap-4">
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept=".json"
              onChange={handleFileUpload}
            />
            <motion.button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-medium transition-colors shadow-lg shadow-gray-900/25 border border-gray-600"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FiUpload size={20} />
              Upload Template
            </motion.button>
            <Link to="/new">
              <motion.button
                className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors shadow-lg shadow-indigo-500/25"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FiPlus size={20} />
                New Mind Map
              </motion.button>
            </Link>
          </div>
        </div>

        {/* How to Use Guide */}
        <HowToUse />

        {/* Search Bar */}
        {graphs.length > 0 && (
          <motion.div
            className="mb-6"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="relative max-w-md">
              <FiSearch
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search mind maps..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-10 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500/50 focus:bg-gray-800 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-gray-700/50 text-gray-400 hover:text-white transition-colors"
                >
                  <FiX size={16} />
                </button>
              )}
            </div>
            {searchQuery && (
              <p className="text-sm text-gray-500 mt-2">
                Showing {filteredGraphs.length} of {graphs.length} mind maps
              </p>
            )}
          </motion.div>
        )}

        {/* Mind Maps Grid */}
        {graphs.length === 0 ? (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiGrid className="text-gray-600 text-4xl" />
            </div>
            <h3 className="text-xl font-semibold text-gray-400 mb-2">
              No mind maps yet
            </h3>
            <p className="text-gray-500 mb-6">
              Create your first mind map to start visualizing your ideas
            </p>
            <div className="flex gap-4 justify-center">
              <motion.button
                onClick={() => fileInputRef.current?.click()}
                className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-medium border border-gray-600"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Upload Template
              </motion.button>
              <Link to="/new">
                <motion.button
                  className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Create Mind Map
                </motion.button>
              </Link>
            </div>
          </motion.div>
        ) : filteredGraphs.length === 0 ? (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiSearch className="text-gray-600 text-4xl" />
            </div>
            <h3 className="text-xl font-semibold text-gray-400 mb-2">
              No results found
            </h3>
            <p className="text-gray-500 mb-4">
              No mind maps match "{searchQuery}"
            </p>
            <button
              onClick={() => setSearchQuery("")}
              className="text-indigo-400 hover:text-indigo-300 font-medium"
            >
              Clear search
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredGraphs.map((graph: Graph, index: number) => (
                <motion.div
                  key={graph.id}
                  layout
                  className="bg-gray-800 border border-gray-700 rounded-xl p-6 hover:border-gray-600 transition-colors group"
                  whileHover={{ y: -4 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.03 }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <Link to={`/${graph.id}`} className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-white truncate hover:text-indigo-400 transition-colors">
                        {graph.title}
                      </h3>
                      {graph.description && (
                        <p className="text-sm text-gray-400 truncate mt-1">
                          {graph.description}
                        </p>
                      )}
                    </Link>
                    <div className="flex gap-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link to={`/${graph.id}`}>
                        <motion.button
                          className="p-1.5 text-gray-400 hover:text-indigo-400 transition-colors rounded-lg hover:bg-gray-700/50"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <FiEdit3 size={16} />
                        </motion.button>
                      </Link>
                      <motion.button
                        onClick={() => deleteGraph(graph.id, graph.title)}
                        className="p-1.5 text-gray-400 hover:text-red-400 transition-colors rounded-lg hover:bg-gray-700/50"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <FiTrash2 size={16} />
                      </motion.button>
                    </div>
                  </div>
                  <Link to={`/${graph.id}`}>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span className="flex items-center gap-1 bg-gray-700/50 px-2 py-1 rounded-lg">
                        {graph.nodeCount} nodes
                      </span>
                      <span className="flex items-center gap-1">
                        <FiCalendar size={14} />
                        {new Date(graph.lastModified).toLocaleDateString()}
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
