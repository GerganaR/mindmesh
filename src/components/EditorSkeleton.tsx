import { motion } from "framer-motion";

const EditorSkeleton = () => {
  return (
    <div className="h-screen w-screen bg-gray-900 flex">
      {/* Sidebar Skeleton */}
      <motion.div
        className="w-80 h-full bg-gray-900/95 border-r border-gray-700/50 p-4"
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-700/50">
          <div className="w-10 h-10 bg-gray-800 rounded-xl animate-pulse" />
          <div>
            <div className="h-5 w-24 bg-gray-800 rounded animate-pulse mb-2" />
            <div className="h-3 w-32 bg-gray-800 rounded animate-pulse" />
          </div>
        </div>

        {/* Title input skeleton */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-gray-800 rounded-lg animate-pulse" />
            <div className="h-4 w-28 bg-gray-800 rounded animate-pulse" />
          </div>
          <div className="h-12 w-full bg-gray-800 rounded-xl animate-pulse" />
        </div>

        {/* Node types section */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-gray-800 rounded-lg animate-pulse" />
            <div>
              <div className="h-4 w-20 bg-gray-800 rounded animate-pulse mb-1" />
              <div className="h-3 w-28 bg-gray-800 rounded animate-pulse" />
            </div>
          </div>

          {/* Node grid */}
          <div className="grid grid-cols-2 gap-3">
            {[...Array(10)].map((_, index) => (
              <motion.div
                key={index}
                className="bg-gray-800 rounded-xl p-3 flex flex-col items-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
              >
                <div className="w-8 h-8 bg-gray-700 rounded-lg mb-2 animate-pulse" />
                <div className="h-3 w-16 bg-gray-700 rounded animate-pulse" />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Actions skeleton */}
        <div className="space-y-3">
          <div className="h-10 w-full bg-gray-800 rounded-xl animate-pulse" />
          <div className="h-10 w-full bg-gray-800 rounded-xl animate-pulse" />
        </div>
      </motion.div>

      {/* Canvas Skeleton */}
      <div className="flex-1 relative bg-gray-900 flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative">
            {/* Animated loading ring */}
            <motion.div
              className="w-16 h-16 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full mx-auto mb-4"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          </div>
          <motion.p
            className="text-gray-400 text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Loading mind map...
          </motion.p>
          <motion.p
            className="text-gray-500 text-sm mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Preparing your visual workspace
          </motion.p>
        </motion.div>

        {/* Decorative background elements */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(99, 102, 241, 0.3) 1px, transparent 0)",
            backgroundSize: "20px 20px",
          }}
        />
      </div>
    </div>
  );
};

export default EditorSkeleton;
