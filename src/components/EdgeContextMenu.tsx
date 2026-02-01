import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { FiTrash2, FiX } from "react-icons/fi";

interface EdgeContextMenuProps {
  x: number;
  y: number;
  onDelete: () => void;
  onClose: () => void;
}

const EdgeContextMenu: React.FC<EdgeContextMenuProps> = ({
  x,
  y,
  onDelete,
  onClose,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <motion.div
      ref={menuRef}
      className="absolute z-50 bg-gray-800/95 backdrop-blur-md rounded-xl border border-gray-700/50 shadow-2xl overflow-hidden min-w-[160px]"
      style={{ top: y, left: x }}
      initial={{ opacity: 0, scale: 0.9, y: -10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-gray-700/50">
        <span className="text-xs font-medium text-gray-400">Edge Options</span>
        <button
          onClick={onClose}
          className="p-1 rounded hover:bg-gray-700/50 text-gray-400 hover:text-white transition-colors"
        >
          <FiX size={12} />
        </button>
      </div>

      {/* Menu Items */}
      <div className="p-1">
        <motion.button
          onClick={onDelete}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-red-400 hover:bg-red-500/20 transition-colors"
          whileHover={{ x: 2 }}
          whileTap={{ scale: 0.98 }}
        >
          <FiTrash2 size={16} />
          <span className="text-sm font-medium">Delete Connection</span>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default EdgeContextMenu;
