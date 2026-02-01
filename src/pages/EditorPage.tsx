import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiAlertCircle } from "react-icons/fi";
import Editor from "../components/Editor";
import EditorSkeleton from "../components/EditorSkeleton";
import { useGraph } from "../api/hooks/useGraphs";

const EditorPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const isNewGraph = !id || id === "new";

  const {
    data: graph,
    isLoading,
    error,
  } = useGraph(isNewGraph ? undefined : id);

  const handleBack = () => {
    navigate("/");
  };

  if (isLoading) {
    return <EditorSkeleton />;
  }

  if (error) {
    return (
      <div className="h-screen w-screen bg-gray-900 flex items-center justify-center">
        <motion.div
          className="text-center max-w-md px-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <FiAlertCircle className="text-red-400 text-6xl mx-auto mb-6" />
          </motion.div>
          <h2 className="text-2xl font-bold text-white mb-3">
            Error Loading Mind Map
          </h2>
          <p className="text-gray-400 mb-6 leading-relaxed">
            {error instanceof Error
              ? error.message
              : "We couldn't load this mind map. It may have been deleted or you may not have access to it."}
          </p>
          <div className="flex gap-3 justify-center">
            <motion.button
              onClick={() => window.location.reload()}
              className="px-5 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-medium transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Try Again
            </motion.button>
            <motion.button
              onClick={handleBack}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Back to Dashboard
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  return <Editor graph={graph || null} />;
};

export default EditorPage;
