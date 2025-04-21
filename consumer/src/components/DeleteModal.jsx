export default function DeleteModal({ onClose, onConfirm }) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-20">
        <div className="bg-white rounded-lg w-72 p-6">
          <h2 className="text-lg font-medium mb-4">Delete Task?</h2>
          <p className="mb-6">Are you sure you want to delete? This action cannot be undone.</p>
          <div className="flex justify-end space-x-3">
            <button
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 cursor-pointer"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 cursor-pointer"
              onClick={onConfirm}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    );
  }