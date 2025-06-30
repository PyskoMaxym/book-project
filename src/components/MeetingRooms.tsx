import React, { useState } from "react";
import EditRoomModal from "./modals/EditRoomModal";
import ConfirmDeleteModal from "./modals/ConfirmDeleteModal";
import EditBookingModal from "./modals/EditBookingModal";
import AddBookingModal from "./modals/AddBookingModal";

interface MeetingRoom {
  id: number;
  name: string;
  description: string;
}

interface Booking {
  id: number;
  roomId: number;
  date: string;
  startTime: string;
  endTime: string;
  description: string;
}

interface MeetingRoomsProps {
  rooms: MeetingRoom[];
  bookings: Booking[];
  setRooms: React.Dispatch<React.SetStateAction<MeetingRoom[]>>;
  setBookings: React.Dispatch<React.SetStateAction<Booking[]>>;
  onLogout: () => void;  // <-- додано
}

const MeetingRooms: React.FC<MeetingRoomsProps> = ({
  rooms,
  bookings,
  setRooms,
  setBookings,
  onLogout,  // <-- приймаємо
}) => {
  const [editingRoom, setEditingRoom] = useState<MeetingRoom | null>(null);
  const [deletingRoomId, setDeletingRoomId] = useState<number | null>(null);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [addingBookingRoomId, setAddingBookingRoomId] = useState<number | null>(null);
  const [formError, setFormError] = useState<string | undefined>(undefined);
  const [newRoomMode, setNewRoomMode] = useState(false);

  const handleRoomChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (editingRoom) {
      setEditingRoom({ ...editingRoom, [e.target.name]: e.target.value });
    }
  };

  const saveRoomChanges = () => {
    if (!editingRoom?.name) {
      setFormError("Room name is required");
      return;
    }

    if (newRoomMode) {
      setRooms(prev => [
        ...prev,
        { ...editingRoom, id: Date.now() }
      ]);
    } else {
      setRooms(prev =>
        prev.map(room => (room.id === editingRoom.id ? editingRoom : room))
      );
    }

    setEditingRoom(null);
    setNewRoomMode(false);
    setFormError(undefined);
  };

  const handleBookingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (editingBooking) {
      setEditingBooking({ ...editingBooking, [e.target.name]: e.target.value });
    }
  };

  const handleAddBookingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (addingBookingRoomId !== null) {
      setEditingBooking(prev => ({
        ...(prev || {
          id: Date.now(),
          roomId: addingBookingRoomId,
          date: "",
          startTime: "",
          endTime: "",
          description: "",
        }),
        [e.target.name]: e.target.value,
      }));
    }
  };

  const saveBookingChanges = () => {
    if (!editingBooking?.date || !editingBooking.startTime || !editingBooking.endTime) {
      setFormError("All fields except description are required");
      return;
    }

    setBookings(prev =>
      prev.map(b => (b.id === editingBooking.id ? editingBooking : b))
    );
    setEditingBooking(null);
    setFormError(undefined);
  };

  const addBooking = () => {
    if (!editingBooking?.date || !editingBooking.startTime || !editingBooking.endTime) {
      setFormError("All fields except description are required");
      return;
    }

    setBookings(prev => [...prev, editingBooking]);
    setEditingBooking(null);
    setAddingBookingRoomId(null);
    setFormError(undefined);
  };

  const confirmDeleteRoom = () => {
    if (deletingRoomId === null) return;

    setRooms(prev => prev.filter(room => room.id !== deletingRoomId));
    setBookings(prev => prev.filter(b => b.roomId !== deletingRoomId));
    setDeletingRoomId(null);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-gradient-to-br from-indigo-50 to-white rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-extrabold text-indigo-800 tracking-wide">Meeting Rooms</h2>
        <div className="flex gap-3">
          <button
            className="px-4 py-2 bg-green-600 hover:bg-green-700 transition text-white font-semibold rounded shadow-md focus:outline-none focus:ring-2 focus:ring-green-400"
            onClick={() => {
              setEditingRoom({ id: 0, name: "", description: "" });
              setNewRoomMode(true);
              setFormError(undefined);
            }}
          >
            + Add Room
          </button>
          <button
            className="px-4 py-2 bg-red-600 hover:bg-red-700 transition text-white font-semibold rounded shadow-md focus:outline-none focus:ring-2 focus:ring-red-400"
            onClick={onLogout}  // <-- кнопка Logout
          >
            Logout
          </button>
        </div>
      </div>

      {rooms.length === 0 && (
        <p className="text-center text-gray-500 italic mb-8">No rooms yet. Please add one.</p>
      )}

      <div className="space-y-6">
        {rooms.map(room => (
          <div
            key={room.id}
            className="bg-white rounded-lg shadow-md p-5 border border-gray-200 hover:shadow-lg transition"
          >
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold text-indigo-700">{room.name}</h3>
              <div className="flex gap-2">
                <button
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-700 transition text-white rounded text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  onClick={() => {
                    setEditingRoom(room);
                    setNewRoomMode(false);
                    setFormError(undefined);
                  }}
                >
                  Edit
                </button>
                <button
                  className="px-3 py-1 bg-green-600 hover:bg-green-700 transition text-white rounded text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                  onClick={() => {
                    setAddingBookingRoomId(room.id);
                    setEditingBooking({
                      id: Date.now(),
                      roomId: room.id,
                      date: "",
                      startTime: "",
                      endTime: "",
                      description: "",
                    });
                    setFormError(undefined);
                  }}
                >
                  Add Booking
                </button>
                <button
                  className="px-3 py-1 bg-red-600 hover:bg-red-700 transition text-white rounded text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-red-400"
                  onClick={() => setDeletingRoomId(room.id)}
                >
                  Delete
                </button>
              </div>
            </div>
            <p className="mt-2 text-gray-600">{room.description || "No description"}</p>
            <div className="mt-4">
              <h4 className="font-semibold text-indigo-800 mb-2">Bookings:</h4>
              {bookings.filter(b => b.roomId === room.id).length === 0 && (
                <p className="text-gray-400 italic text-sm">No bookings yet</p>
              )}
              {bookings
                .filter(b => b.roomId === room.id)
                .map(b => (
                  <div
                    key={b.id}
                    className="border border-gray-200 rounded p-3 mb-2 bg-indigo-50 hover:bg-indigo-100 transition cursor-pointer"
                  >
                    <p className="text-sm font-semibold text-indigo-700">
                      <span>{b.date}</span>{" "}
                      <span className="text-gray-600 font-normal">
                        {b.startTime} - {b.endTime}
                      </span>
                    </p>
                    <p className="text-gray-700 text-sm">{b.description || "No details"}</p>
                    <button
                      className="mt-2 px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded text-xs font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-300"
                      onClick={() => {
                        setEditingBooking(b);
                        setFormError(undefined);
                      }}
                    >
                      Edit Booking
                    </button>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>

      {editingRoom && (
        <EditRoomModal
          name={editingRoom.name}
          description={editingRoom.description}
          onChange={handleRoomChange}
          onSave={saveRoomChanges}
          onCancel={() => {
            setEditingRoom(null);
            setNewRoomMode(false);
            setFormError(undefined);
          }}
          error={formError}
        />
      )}

      {deletingRoomId !== null && (
        <ConfirmDeleteModal
          title="Confirm Deletion"
          message="Are you sure you want to delete this room and all its bookings?"
          onConfirm={confirmDeleteRoom}
          onCancel={() => setDeletingRoomId(null)}
        />
      )}

      {editingBooking && editingBooking.roomId !== undefined && (
        <EditBookingModal
          form={editingBooking}
          onChange={handleBookingChange}
          onSave={saveBookingChanges}
          onCancel={() => setEditingBooking(null)}
          error={formError}
        />
      )}

      {addingBookingRoomId !== null && editingBooking && (
        <AddBookingModal
          form={editingBooking}
          onChange={handleAddBookingChange}
          onSave={addBooking}
          onCancel={() => {
            setEditingBooking(null);
            setAddingBookingRoomId(null);
          }}
          error={formError}
        />
      )}
    </div>
  );
};

export default MeetingRooms;
  