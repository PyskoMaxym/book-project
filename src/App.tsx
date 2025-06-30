import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import RegisterForm from "./components/RegisterForm";
import LoginForm from "./components/Login";
import MeetingRooms from "./components/MeetingRooms";
import Bookings from "./components/Bookings";

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

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [rooms, setRooms] = useState<MeetingRoom[]>(() => {
    const saved = localStorage.getItem("meet-rooms");
    return saved ? JSON.parse(saved) : [];
  });

  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem("meet-bookings");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("meet-rooms", JSON.stringify(rooms));
  }, [rooms]);

  useEffect(() => {
    localStorage.setItem("meet-bookings", JSON.stringify(bookings));
  }, [bookings]);

  const handleLogin = () => {
    localStorage.setItem("token", "fake-token");
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          isAuthenticated ? <Navigate to="/meet-rooms" /> : <Navigate to="/login" />
        }
      />

      <Route
        path="/login"
        element={
          isAuthenticated ? (
            <Navigate to="/meet-rooms" />
          ) : (
            <LoginForm onLogin={handleLogin} />
          )
        }
      />

      <Route
        path="/register"
        element={
          isAuthenticated ? (
            <Navigate to="/meet-rooms" />
          ) : (
            <RegisterForm onRegister={handleLogin} />
          )
        }
      />

      <Route
        path="/meet-rooms"
        element={
          isAuthenticated ? (
            <MeetingRooms
              rooms={rooms}
              setRooms={setRooms}
              bookings={bookings}
              setBookings={setBookings}
              onLogout={handleLogout}  // передаємо сюди
            />
          ) : (
            <Navigate to="/login" />
          )
        }
      />

      <Route
        path="/bookings"
        element={
          isAuthenticated ? (
            <Bookings
              rooms={rooms}
              bookings={bookings}
              setBookings={setBookings}
            />
          ) : (
            <Navigate to="/login" />
          )
        }
      />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
