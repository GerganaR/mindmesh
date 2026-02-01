import { motion } from "framer-motion";

const DashboardSkeleton = () => {
  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Skeleton */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="h-9 w-48 bg-gray-800 rounded-lg animate-pulse mb-2" />
            <div className="h-4 w-64 bg-gray-800 rounded animate-pulse" />
          </div>
          <div className="flex gap-4">
            <div className="h-12 w-44 bg-gray-800 rounded-xl animate-pulse" />
            <div className="h-12 w-44 bg-gray-800 rounded-xl animate-pulse" />
          </div>
        </div>

        {/* How to Use Guide Skeleton */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6 mb-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-12 w-12 bg-gray-700 rounded-lg animate-pulse" />
            <div className="h-6 w-48 bg-gray-700 rounded animate-pulse" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {[...Array(5)].map((_, index) => (
              <div
                key={index}
                className="bg-gray-900/80 p-4 rounded-xl border border-gray-700/50"
              >
                <div className="h-6 w-6 bg-gray-700 rounded animate-pulse mb-3" />
                <div className="h-5 w-24 bg-gray-700 rounded animate-pulse mb-2" />
                <div className="h-3 w-full bg-gray-700 rounded animate-pulse mb-1" />
                <div className="h-3 w-3/4 bg-gray-700 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>

        {/* Search Bar Skeleton */}
        <div className="mb-6">
          <div className="h-12 w-full max-w-md bg-gray-800 rounded-xl animate-pulse" />
        </div>

        {/* Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <motion.div
              key={index}
              className="bg-gray-800 border border-gray-700 rounded-xl p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              {/* Title and actions */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 min-w-0">
                  <div className="h-6 w-3/4 bg-gray-700 rounded animate-pulse mb-2" />
                  <div className="h-4 w-1/2 bg-gray-700 rounded animate-pulse" />
                </div>
                <div className="flex gap-1 ml-2">
                  <div className="h-7 w-7 bg-gray-700 rounded-lg animate-pulse" />
                  <div className="h-7 w-7 bg-gray-700 rounded-lg animate-pulse" />
                </div>
              </div>
              {/* Meta info */}
              <div className="flex items-center justify-between text-sm">
                <div className="h-6 w-20 bg-gray-700 rounded-lg animate-pulse" />
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
