import { motion, AnimatePresence } from "framer-motion";
import {
  FiPlus,
  FiUpload,
  FiMousePointer,
  FiEdit3,
  FiSave,
  FiInfo,
  FiX,
  FiLayout,
} from "react-icons/fi";
import { useState } from "react";

const steps = [
  {
    icon: <FiPlus className="text-indigo-400" size={24} />,
    title: "Create or Upload",
    description: "Start from scratch or upload a JSON template to begin.",
  },
  {
    icon: <FiMousePointer className="text-emerald-400" size={24} />,
    title: "Drag & Drop",
    description: "Drag nodes from the sidebar onto the canvas.",
  },
  {
    icon: <FiLayout className="text-blue-400" size={24} />,
    title: "Connect Nodes",
    description: "Drag from a node's handle to connect it to another.",
  },
  {
    icon: <FiEdit3 className="text-amber-400" size={24} />,
    title: "Edit Content",
    description: "Double-click any node to edit its label and description.",
  },
  {
    icon: <FiSave className="text-rose-400" size={24} />,
    title: "Save Work",
    description: "Give your map a title and save changes anytime.",
  },
];

const HowToUse = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) {
    return (
      <motion.button
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={() => setIsVisible(true)}
        className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-indigo-400 rounded-lg border border-indigo-500/30 transition-colors mb-8 mx-auto text-sm font-medium"
      >
        <FiInfo size={16} />
        Show Guide
      </motion.button>
    );
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20, height: 0 }}
          animate={{ opacity: 1, y: 0, height: "auto" }}
          exit={{ opacity: 0, y: -20, height: 0 }}
          className="relative bg-gray-800/50 border border-gray-700 rounded-2xl p-6 mb-10 overflow-hidden"
        >
          <div className="absolute top-4 right-4">
            <button
              onClick={() => setIsVisible(false)}
              className="p-2 text-gray-500 hover:text-white rounded-lg hover:bg-gray-700 transition-colors"
              title="Dismiss guide"
            >
              <FiX size={20} />
            </button>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-indigo-500/20 rounded-lg">
              <FiInfo className="text-indigo-400" size={24} />
            </div>
            <h2 className="text-xl font-bold text-white">
              How to use MindMesh
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-900/80 p-4 rounded-xl border border-gray-700/50 hover:border-gray-600 transition-colors"
              >
                <div className="mb-3">{step.icon}</div>
                <h3 className="text-white font-semibold mb-1">{step.title}</h3>
                <p className="text-gray-400 text-xs leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default HowToUse;
