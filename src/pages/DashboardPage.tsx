import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiPlus, FiEdit3, FiTrash2, FiCalendar } from "react-icons/fi";
import { useGraphs, useDeleteGraph } from "../api/hooks/useGraphs";
import type { Graph } from "../types/graph";

const Dashboard = () => {
  const { data: graphs = [], isLoading, error } = useGraphs();
  const deleteGraphMutation = useDeleteGraph();

  console.log("graphs", graphs, "isLoading", isLoading, "error", error);

  const deleteGraph = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this graph?")) {
      try {
        await deleteGraphMutation.mutateAsync(id);
      } catch (error) {
        console.error("Error deleting graph:", error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-red-400">Error loading graphs</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Graphs</h1>
            <p className="text-gray-400">Create and manage your graphs</p>
          </div>
          <Link to="/new">
            <motion.button
              className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FiPlus size={20} />
              New Mind Map
            </motion.button>
          </Link>
        </div>

        {/* Mind Maps Grid */}
        {graphs.length === 0 ? (
          <div className="text-center py-16">
            <h3 className="text-xl font-semibold text-gray-400 mb-2">
              No graphs yet
            </h3>
            <p className="text-gray-500 mb-6">
              Create your first graph to get started
            </p>
            <Link to="/new">
              <motion.button
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Create Graph
              </motion.button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {graphs.map((graph: Graph) => (
              <motion.div
                key={graph.id}
                className="bg-gray-800 border border-gray-700 rounded-xl p-6 hover:border-gray-600 transition-colors"
                whileHover={{ y: -4 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white truncate">
                    {graph.title}
                  </h3>
                  <div className="flex gap-1">
                    <Link to={`/${graph.id}`}>
                      <button className="p-1.5 text-gray-400 hover:text-indigo-400 transition-colors">
                        <FiEdit3 size={16} />
                      </button>
                    </Link>
                    <button
                      onClick={() => deleteGraph(graph.id)}
                      className="p-1.5 text-gray-400 hover:text-red-400 transition-colors"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    {graph.nodeCount} nodes
                  </span>
                  <span className="flex items-center gap-1">
                    <FiCalendar size={14} />
                    {new Date(graph.lastModified).toLocaleDateString()}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
