import { Route, Routes, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import AdminRoute from "./AdminRoute";
import Leads from "../pages/Leads";
import CreateLead from "../pages/CreateLead";
import EditLead from "../pages/EditLead";
import AdminDashboard from "../pages/AdminDashboard";
import Login from "../pages/Login";
import Users from "../pages/Users";
import CreateUser from "../pages/CreateUser";
import Tasks from "../pages/Tasks";
import Analytics from "../pages/Analytics";
import Settings from "../pages/Settings";
import ProtectedRoute from "./ProtectedRoute"; // Assuming ProtectedRoute is a new component

const AppRoutes = () => {
  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/login" element={<Login />} />
        
        {/* Dashboard Routes */}
        <Route path="/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
        <Route path="/dashboard/leads" element={<ProtectedRoute><Leads /></ProtectedRoute>} />
        <Route path="/dashboard/create-lead" element={<ProtectedRoute><CreateLead /></ProtectedRoute>} />
        <Route path="/dashboard/leads/edit/:id" element={<ProtectedRoute><EditLead /></ProtectedRoute>} />
        
        <Route path="/dashboard/team" element={<ProtectedRoute><Users /></ProtectedRoute>} />
        <Route path="/dashboard/create-user" element={<ProtectedRoute><CreateUser /></ProtectedRoute>} />
        <Route path="/dashboard/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
        <Route path="/dashboard/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        
        <Route path="/dashboard/tasks" element={<ProtectedRoute><Tasks /></ProtectedRoute>} />
      </Routes>
    </>
  );
};

export default AppRoutes;
