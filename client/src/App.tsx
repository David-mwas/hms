import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./contexts/AuthContext";
import { useAuth } from "./contexts/AuthContext";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import DoctorDashboard from "./pages/DoctorDashboard";
import PatientDashboard from "./pages/PatientDashboard";
import Appointments from "./pages/Appointments";
import Payments from "./pages/Payments";
import "./App.css";
import Register from "./pages/Register";

function ProtectedRoute({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles: string[];
}) {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated && !user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user?.role || "")) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  const { isAuthenticated, user } = useAuth();

  return (
    <Routes>
      <Route
        path="/login"
        element={
          !isAuthenticated && !user ? (
            <Login />
          ) : (
            <Navigate to={`/${user?.role}`} replace />
          )
        }
      />
      <Route
        path="/register"
        element={
          !isAuthenticated && !user ? (
            <Register />
          ) : (
            <Navigate to={`/${user?.role}`} replace />
          )
        }
      />

      <Route
        path="/admin/*"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/doctor/*"
        element={
          <ProtectedRoute allowedRoles={["doctor"]}>
            <DoctorDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/patient/*"
        element={
          <ProtectedRoute allowedRoles={["patient"]}>
            <PatientDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/appointments"
        element={
          <ProtectedRoute allowedRoles={["admin", "doctor", "patient"]}>
            <Appointments />
          </ProtectedRoute>
        }
      />

      <Route
        path="/payments"
        element={
          <ProtectedRoute allowedRoles={["admin", "patient"]}>
            <Payments />
          </ProtectedRoute>
        }
      />

      <Route
        path="/"
        element={
          isAuthenticated && user ? (
            <Navigate to={`/${user?.role}`} replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <AppRoutes />
          <Toaster position="top-right" />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
