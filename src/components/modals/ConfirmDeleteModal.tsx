import React from "react";

interface ConfirmDeleteModalProps {
  title: string;
  message: React.ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  onConfirm,
  onCancel
}) => {
  return (
    <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 border-4 border-black rounded shadow max-w-sm w-full">
        <h3 className="text-xl font-semibold mb-4">Are you sure?</h3>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Confirm
          </button>
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-400 rounded hover:bg-gray-500"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
