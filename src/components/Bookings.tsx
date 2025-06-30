import React, { useState} from "react";

interface Booking {
  id: number;
  roomId: number;
  date: string; 
  startTime: string; 
  endTime: string;   
  description: string;
}

interface Room {
  id: number;
  name: string;
}

interface BookingsProps {
  rooms: Room[];
  bookings: Booking[];
  setBookings: React.Dispatch<React.SetStateAction<Booking[]>>;
}

const Bookings: React.FC<BookingsProps> = ({ rooms, bookings, setBookings }) => {
  const [form, setForm] = useState({
    roomId: rooms.length > 0 ? rooms[0].id : 0,
    date: "",
    startTime: "",
    endTime: "",
    description: "",
  });
  const [editId, setEditId] = useState<number | null>(null);
  const [error, setError] = useState<string>("");  

  const resetForm = () => {
    setForm({
      roomId: rooms.length > 0 ? rooms[0].id : 0,
      date: "",
      startTime: "",
      endTime: "",
      description: "",
    });
    setEditId(null);
    setError("");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({...form, [e.target.name]: e.target.value});
    if(error) setError("");
  };


  const hasConflict = (newBooking: Booking) => {
    return bookings.some(b => 
      b.id !== newBooking.id && 
      b.roomId === newBooking.roomId &&
      b.date === newBooking.date &&
      !(newBooking.endTime <= b.startTime || newBooking.startTime >= b.endTime) 
    );
  };

  const handleSubmit = () => {
    if (!form.date || !form.startTime || !form.endTime) {
      setError("Дата та час початку/кінця обов’язкові");
      return;
    }
    if (form.startTime >= form.endTime) {
      setError("Час початку повинен бути раніше часу кінця");
      return;
    }
    const newBooking: Booking = {
      id: editId ?? Date.now(),
      roomId: form.roomId,
      date: form.date,
      startTime: form.startTime,
      endTime: form.endTime,
      description: form.description,
    };

    if (hasConflict(newBooking)) {
      setError("Конфлікт бронювань: цей час вже зайнятий");
      return;
    }

    if (editId === null) {
      setBookings([...bookings, newBooking]);
    } else {
      setBookings(bookings.map(b => (b.id === editId ? newBooking : b)));
    }

    resetForm();
  };

  const handleEdit = (id: number) => {
    const booking = bookings.find(b => b.id === id);
    if (booking) {
      setForm({
        roomId: booking.roomId,
        date: booking.date,
        startTime: booking.startTime,
        endTime: booking.endTime,
        description: booking.description,
      });
      setEditId(id);
      setError("");
    }
  };

  const handleDelete = (id: number) => {
    setBookings(bookings.filter(b => b.id !== id));
    if (editId === id) resetForm();
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Бронювання кімнат</h2>

      <div className="mb-6 border p-4 rounded shadow">
        <label className="block mb-2">
          Кімната:
          <select name="roomId" value={form.roomId} onChange={handleInputChange} className="ml-2 p-1 border rounded">
            {rooms.map(room => (
              <option key={room.id} value={room.id}>{room.name}</option>
            ))}
          </select>
        </label>

        <label className="block mb-2">
          Дата:
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleInputChange}
            className="ml-2 p-1 border rounded"
          />
        </label>

        <label className="block mb-2">
          Час початку:
          <input
            type="time"
            name="startTime"
            value={form.startTime}
            onChange={handleInputChange}
            className="ml-2 p-1 border rounded"
          />
        </label>

        <label className="block mb-2">
          Час кінця:
          <input
            type="time"
            name="endTime"
            value={form.endTime}
            onChange={handleInputChange}
            className="ml-2 p-1 border rounded"
          />
        </label>

        <label className="block mb-4">
          Опис:
          <textarea
            name="description"
            value={form.description}
            onChange={handleInputChange}
            rows={2}
            className="w-full p-2 border rounded"
            placeholder="Опціонально"
          />
        </label>

        {error && <p className="text-red-600 mb-2">{error}</p>}

        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {editId === null ? "Додати бронювання" : "Оновити бронювання"}
        </button>

        {editId !== null && (
          <button
            onClick={resetForm}
            className="ml-2 px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
          >
            Скасувати
          </button>
        )}
      </div>

      <h3 className="text-xl font-semibold mb-3">Існуючі бронювання</h3>
      {bookings.length === 0 && <p>Бронювань поки немає</p>}
      <ul>
        {bookings.map(b => {
          const room = rooms.find(r => r.id === b.roomId);
          return (
            <li key={b.id} className="mb-3 p-3 border rounded shadow flex justify-between items-center">
              <div>
                <p><b>Кімната:</b> {room?.name || "Не вибрано"}</p>
                <p><b>Дата:</b> {b.date}</p>
                <p><b>Час:</b> {b.startTime} - {b.endTime}</p>
                {b.description && <p><b>Опис:</b> {b.description}</p>}
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => handleEdit(b.id)}
                  className="px-3 py-1 bg-yellow-400 rounded hover:bg-yellow-500"
                >
                  Редагувати
                </button>
                <button
                  onClick={() => handleDelete(b.id)}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Скасувати
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Bookings;
