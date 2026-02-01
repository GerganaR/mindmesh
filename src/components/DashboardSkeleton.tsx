import { motion } from "framer-motion";

const DashboardSkeleton = () => {
  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="h-8 w-32 bg-gray-800 rounded-lg animate-pulse mb-2" />
            <div className="h-4 w-48 bg-gray-800 rounded animate-pulse" />
          </div>
          <div className="h-12 w-40 bg-gray-800 rounded-xl animate-pulse" />
        </div>

        {/* Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, index) => (
            <motion.div
              key={index}
              className="bg-gray-800 border border-gray-700 rounded-xl p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              {/* Title and actions */}
              <div className="flex items-start justify-between mb-4">
                <div className="h-6 w-3/4 bg-gray-700 rounded animate-pulse" />
                <div className="flex gap-1">
                  <div className="h-8 w-8 bg-gray-700 rounded animate-pulse" />
                  <div className="h-8 w-8 bg-gray-700 rounded animate-pulse" />
                </div>
              </div>
              {/* Meta info */}
              <div className="flex items-center justify-between">
                <div className="h-4 w-20 bg-gray-700 rounded animate-pulse" />
                <div className="h-4 w-24 bg-gray-700 rounded animate-pulse" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardSkeleton;
