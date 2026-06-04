import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminRoute() {
  const { user, loading } = useAuth();

  if (loading) return <div className="mx-auto max-w-6xl px-4 py-16">Loading...</div>;
  if (!user || user.role !== "admin") return <Navigate to="/login" replace />;
  return <Outlet />;
}
