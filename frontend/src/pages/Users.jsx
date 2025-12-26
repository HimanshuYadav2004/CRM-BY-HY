import { useEffect, useState } from "react";
import {
  Users as UsersIcon,
  Plus,
  Loader2,
  Mail,
  Shield,
  Briefcase
} from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout";
import axios from "../api/axios";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { Switch } from "@/components/ui/switch";

const Users = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch users from API (Need to create api/user.api.js later, but direct axios for now)
  const fetchUsers = async () => {
    try {
      const response = await axios.get("/api/admin/users");
      setUsers(response.data.users);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleStatus = async (userId, currentStatus) => {
    try {
        await axios.patch(`/api/admin/users/${userId}/toggle-status`);
        toast.success("User status updated");
        fetchUsers(); // Refresh list to get new state
    } catch (err) {
        toast.error(err.response?.data?.message || "Failed to update status");
    }
  };

  if (loading) {
    return (
        <DashboardLayout>
            <div className="flex h-[80vh] items-center justify-center">
                <Loader2 className="w-12 h-12 text-primary animate-spin opacity-50" />
            </div>
        </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold tracking-tight text-slate-900">Team Members</h2>
                  <p className="text-slate-500 mt-1">Manage user access and roles.</p>
                </div>
                <Button onClick={() => navigate("/dashboard/create-user")} className="h-11 rounded-xl bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25">
                    <Plus className="mr-2 h-4 w-4" /> Add User
                </Button>
            </div>

             <Card className="border-none shadow-dribbble rounded-[2rem] overflow-hidden bg-white">
                 <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-b border-slate-100 hover:bg-transparent">
                                <TableHead className="pl-6 py-4">Name</TableHead>
                                <TableHead className="py-4">Role</TableHead>
                                <TableHead className="py-4">Department</TableHead>
                                <TableHead className="py-4">Status & Access</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-24 text-center text-slate-500">
                                        No users found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                users.map((user) => (
                                    <TableRow key={user._id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                                        <TableCell className="pl-6 py-4 font-medium">
                                            <div className="flex items-center gap-3">
                                                <div className="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600 shadow-inner">
                                                    {user.name?.[0]?.toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="text-slate-900 font-medium">{user.name}</div>
                                                    <div className="text-xs text-slate-400 flex items-center gap-1">
                                                        <Mail className="h-3 w-3" /> {user.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-4">
                                            <Badge variant={user.role === 'admin' ? "default" : "secondary"} className="capitalize">
                                                {user.role}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="py-4 capitalize text-slate-500">
                                            {user.department || "-"}
                                        </TableCell>
                                        <TableCell className="py-4">
                                            <div className="flex items-center gap-3">
                                                <Switch 
                                                    checked={user.isActive} 
                                                    onCheckedChange={() => handleToggleStatus(user._id, user.isActive)}
                                                    disabled={user.role === 'admin'}
                                                />
                                                <span className={`text-sm font-medium ${user.isActive ? 'text-emerald-600' : 'text-slate-400'}`}>
                                                    {user.isActive ? 'Active' : 'Inactive'}
                                                </span>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                 </CardContent>
             </Card>
        </div>
    </DashboardLayout>
  );
};

export default Users;
