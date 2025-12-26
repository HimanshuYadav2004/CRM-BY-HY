import { Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import AdminRoute from "./AdminRoute";
import Leads from "../pages/Leads";
import CreateLead from "../pages/CreateLead";
import EditLead from "../pages/EditLead";
import AdminDashboard from "../pages/AdminDashboard";
import Login from "../pages/Login";

const AppRoutes = () => {
  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        
        {/* Admin Routes (Protected) */}
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/leads" element={<Leads />} />
          <Route path="/admin/create-lead" element={<CreateLead />} />
          <Route path="/admin/leads/edit/:id" element={<EditLead />} />
        </Route>
      </Routes>
    </>
  );
};

export default AppRoutes;
