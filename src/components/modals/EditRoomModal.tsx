import React from "react";

interface EditRoomModalProps {
  name: string;
  description: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSave: () => void;
  onCancel: () => void;
  error?: string;
  isNew?: boolean;  
}

const EditRoomModal: React.FC<EditRoomModalProps> = ({
  name,
  description,
  onChange,
  onSave,
  onCancel,
  error,
  isNew = false,  
}) => {
  return (
    <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-4 border border-black rounded shadow max-w-sm w-full">
        <h3 className="text-lg font-semibold mb-2">
          {isNew ? "Add New Room" : "Edit Room"}
        </h3>

        <label className="block text-sm font-medium mb-1" htmlFor="room-name">
          Room Name:
        </label>
        <input
          type="text"
          name="name"
          value={name}
          onChange={onChange}
          id="room-name"
          className={`w-full px-2 py-1 border rounded text-sm ${
            error ? "border-red-500" : "border-gray-300"
          }`}
        />

        <label className="block text-sm font-medium mt-3 mb-1" htmlFor="room-description">
          Description:
        </label>
        <textarea
          name="description"
          value={description}
          onChange={onChange}
          id="room-description"
          rows={2}
          className="w-full px-2 py-1 border rounded text-sm resize-none mt-2"
        />

        {error && <p className="text-red-600 text-sm mt-2">{error}</p>}

        <div className="flex justify-end mt-4 space-x-2">
          <button
            onClick={onSave}
            className={`px-3 py-1 text-white rounded hover:opacity-90 ${
              isNew ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isNew ? "Add Room" : "Save changes"}
          </button>
          <button
            onClick={onCancel}
            className="px-3 py-1 bg-gray-400 text-white rounded hover:bg-gray-500"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditRoomModal;
