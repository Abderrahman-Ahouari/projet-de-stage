import { useState } from "react";
import { useOutlet, useOutletContext, useParams } from "react-router-dom";

import { useIsFetching } from "@tanstack/react-query";

export default function CategorizeModal({
  onClose,
  onSelect,
  categories,
  onAdd,
  taskCategory,
  onDelete,
}) {
  const {permissionsNames} = useOutletContext()
  const { id } = useParams();
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const loading = useIsFetching();
  const handleSubmit = () => {
    if (name.trim().length < 3) {
      setError("Name must be at least 3 characters.");
      return;
    }
    setError("");
    onAdd(id, { name });
    setName(""); // reset input after successful submit
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-20">
      <div className="relative bg-white rounded-lg w-64 max-h-80 p-4">
        <h2 className="text-lg font-medium mb-4">Select category</h2>

        {permissionsNames.includes('add category') &&
          <div className="mt-4">
          <div className="flex items-center gap-1 w-full">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="New category name"
              className="flex-1 px-2 py-1 border border-gray-300 rounded w-[50%]"
              disabled={loading}
            />
            <button
              onClick={handleSubmit}
              className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 cursor-pointer"
              disabled={loading}
            >
              +
            </button>
          </div>
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>}

        <div className="bg-white rounded-lg max-h-40 overflow-auto p-4 gap-1 flex flex-col">
          {categories.map((cat) => (
            <div
              key={cat.id || -1}
              className={`flex items-center justify-between `}
            >
              <button
                className={`flex-1 text-left px-3 py-2 rounded cursor-pointer ${
                taskCategory === cat.name
                  ? "bg-blue-500 text-white"
                  : "bg-gray-50 hover:bg-gray-100"
              }`}
                onClick={() => onSelect(cat)}
                disabled={loading}
              >
                {cat.name}
              </button>
              {permissionsNames.includes('delete category') &&
                <button
                onClick={() => onDelete(id, cat.id)}
                disabled={loading}
                className="ml-2 text-red-500 hover:text-red-700 hover:bg-gray-200 rounded-xs cursor-pointer px-1 py-2 transition-colors"
                title="Delete category"
              >
                🗑️
              </button>}
            </div>
          ))}
        </div>

        <button
          className="mt-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 cursor-pointer w-full"
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
