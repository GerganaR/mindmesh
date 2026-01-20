import React, { useEffect, useRef } from "react";
import { FiTrash2 } from "react-icons/fi";

interface ContextMenuProps {
  x: number;
  y: number;
  onDelete: () => void;
  onClose: () => void;
}

const ContextMenu: React.FC<ContextMenuProps> = ({
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

    // Use capture phase to ensure we handle the event even if propagation is stopped
    document.addEventListener("mousedown", handleClickOutside, true);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside, true);
    };
  }, [onClose]);

  return (
    <div
      ref={menuRef}
      style={{ top: y, left: x }}
      className="absolute z-50 bg-[#1E293B] border border-white/20 rounded-lg shadow-xl overflow-hidden min-w-[150px]"
    >
      <button
        onClick={onDelete}
        className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-white/5 hover:text-red-300 flex items-center gap-2 transition-colors"
      >
        <FiTrash2 size={16} />
        Delete Node
      </button>
    </div>
  );
};

export default ContextMenu;
