import React from "react";

interface BookingForm {
  date: string;
  startTime: string;
  endTime: string;
  description: string;
}

interface EditBookingModalProps {
  form: BookingForm;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSave: () => void;
  onCancel: () => void;
  error?: string;
}

const EditBookingModal: React.FC<EditBookingModalProps> = ({
  form,
  onChange,
  onSave,
  onCancel,
  error,
}) => {
  return (
    <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-4 border border-black rounded shadow max-w-sm w-full">
        <h3 className="text-lg font-semibold mb-2">Edit Booking</h3>
        <label className="text-sm">Date:</label>
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={onChange}
          className={`w-full px-2 py-1 border rounded text-sm ${error ? "border-red-500" : "border-gray-300"}`}
        />
        <div className="flex space-x-2 mt-2">
          <div className="w-1/2">
            <label className="text-sm">Start Time:</label>
            <input
              type="time"
              name="startTime"
              value={form.startTime}
              onChange={onChange}
              className="w-full px-2 py-1 border rounded text-sm"
            />
          </div>
          <div className="w-1/2">
            <label className="text-sm">End Time:</label>
            <input
              type="time"
              name="endTime"
              value={form.endTime}
              onChange={onChange}
              className="w-full px-2 py-1 border rounded text-sm"
            />
          </div>
        </div>
        <label className="text-sm mt-2">Description (optional):</label>
        <textarea
          name="description"
          value={form.description}
          onChange={onChange}
          rows={2}
          className="w-full px-2 py-1 border rounded text-sm resize-none"
        />
        {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
        <div className="flex justify-end mt-4 space-x-2">
          <button
            onClick={onSave}
            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Save changes
          </button>
          <button type="button"
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

export default EditBookingModal;
