import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "./components/ProtectedRoute.jsx";
import { useAuth } from "./context/AuthContext.jsx";
import { DashboardLayout } from "./components/layout/DashboardLayout.jsx";
import { LoginPage } from "./pages/LoginPage.jsx";
import { RegisterPage } from "./pages/RegisterPage.jsx";
import { RoomsPage } from "./pages/RoomsPage.jsx";
import { MyBookingsPage } from "./pages/MyBookingsPage.jsx";
import { AdminRoomsPage } from "./pages/AdminRoomsPage.jsx";
import { AdminBookingsPage } from "./pages/AdminBookingsPage.jsx";

function HomeRedirect() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to="/rooms" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<HomeRedirect />} />
        <Route path="rooms" element={<RoomsPage />} />
        <Route path="bookings" element={<MyBookingsPage />} />
        <Route
          path="admin/rooms"
          element={
            <ProtectedRoute adminOnly>
              <AdminRoomsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/bookings"
          element={
            <ProtectedRoute adminOnly>
              <AdminBookingsPage />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}


