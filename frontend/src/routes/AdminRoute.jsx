import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../app/AuthContext";

const AdminRoute = () => {
  const { user, loading } = useAuth();

  if (loading) return null; // or spinner

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "admin") {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;
