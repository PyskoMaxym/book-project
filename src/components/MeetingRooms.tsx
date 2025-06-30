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
    <div className="p-4 max-w-screen-md mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Meeting Rooms</h2>
        <div className="flex gap-2">
          <button
            className="px-3 py-1 bg-green-600 text-white rounded text-sm"
            onClick={() => {
              setEditingRoom({ id: 0, name: "", description: "" });
              setNewRoomMode(true);
            }}
          >
            Add Room
          </button>
          <button
            className="px-3 py-1 bg-red-600 text-white rounded text-sm"
            onClick={onLogout}  // <-- кнопка Logout
          >
            Logout
          </button>
        </div>
      </div>

      {rooms.map(room => (
        <div
          key={room.id}
          className="border p-2 rounded mb-4 text-sm bg-white shadow max-w-sm w-full mx-auto"
        >
          <h3 className="text-base font-semibold">{room.name}</h3>
          <p className="text-gray-700">{room.description}</p>
          <div className="flex gap-2 mt-2">
            <button
              className="px-2 py-1 bg-blue-500 text-white text-xs rounded"
              onClick={() => {
                setEditingRoom(room);
                setNewRoomMode(false);
              }}
            >
              Edit
            </button>
            <button
              className="px-2 py-1 bg-green-500 text-white text-xs rounded"
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
              }}
            >
              Add Booking
            </button>
            <button
              className="px-2 py-1 bg-red-500 text-white text-xs rounded"
              onClick={() => setDeletingRoomId(room.id)}
            >
              Delete
            </button>
          </div>
          <div className="mt-3">
            <h4 className="font-medium text-sm">Bookings:</h4>
            {bookings
              .filter(b => b.roomId === room.id)
              .map(b => (
                <div
                  key={b.id}
                  className="border p-1 rounded mt-1 bg-gray-50 text-xs"
                >
                  <p>
                    <strong>{b.date}</strong> {b.startTime} - {b.endTime}
                  </p>
                  <p className="text-gray-600">{b.description}</p>
                  <button
                    className="mt-1 px-2 py-0.5 bg-yellow-500 text-white rounded text-xs"
                    onClick={() => setEditingBooking(b)}
                  >
                    Edit Booking
                  </button>
                </div>
              ))}
          </div>
        </div>
      ))}

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
