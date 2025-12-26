import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import axios from "../api/axios";
import DashboardLayout from "../components/layout/DashboardLayout";

// shadcn components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CreateUser = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "user",
    department: "sales"
  });
  const [tempPassword, setTempPassword] = useState("");

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (val, field) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setTempPassword("");
    
    try {
      const response = await axios.post("/api/admin/users", formData);
      toast.success("User created successfully!");
      setTempPassword(response.data.temporaryPassword);
      // Don't navigate immediately so they can copy the password
    } catch (err) {
      console.error("Failed to create user:", err);
      toast.error(err.response?.data?.message || "Failed to create user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6">
         <div className="flex items-center gap-4">
            <Button variant="ghost" className="rounded-xl h-10 w-10 p-0" onClick={() => navigate("/dashboard/team")}>
                <ArrowLeft className="h-5 w-5 text-slate-500" />
            </Button>
            <div>
                 <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Create User</h1>
                 <p className="text-slate-500 text-sm">Add a new member to your team.</p>
            </div>
         </div>

         {tempPassword && (
             <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-emerald-800 shadow-sm animate-in fade-in zoom-in-95">
                 <h3 className="font-bold text-lg mb-2">User Created Successfully!</h3>
                 <p className="mb-4">Please share this temporary password with the user:</p>
                 <div className="bg-white p-4 rounded-xl border border-emerald-100 font-mono text-xl tracking-wider text-center select-all">
                     {tempPassword}
                 </div>
                 <Button onClick={() => navigate("/dashboard/team")} className="mt-4 w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl">
                     Done
                 </Button>
             </div>
         )}

         {!tempPassword && (
            <Card className="border-none shadow-dribbble rounded-[2rem] overflow-hidden bg-white">
                <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                    <CardTitle className="text-lg">User Details</CardTitle>
                    <CardDescription>Enter the basic information for the new user.</CardDescription>
                </CardHeader>
                <CardContent className="p-6 pt-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                            id="name"
                            placeholder="John Doe"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            className="h-11 rounded-xl"
                        />
                    </div>
                    
                    <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="john@example.com"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            className="h-11 rounded-xl"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Role</Label>
                            <Select value={formData.role} onValueChange={(val) => handleSelectChange(val, "role")}>
                                <SelectTrigger className="h-11 rounded-xl">
                                    <SelectValue placeholder="Select role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="user">User (Sales)</SelectItem>
                                    <SelectItem value="manager">Manager</SelectItem>
                                    <SelectItem value="admin">Admin</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Department</Label>
                            <Select value={formData.department} onValueChange={(val) => handleSelectChange(val, "department")}>
                                <SelectTrigger className="h-11 rounded-xl">
                                    <SelectValue placeholder="Select department" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="sales">Sales</SelectItem>
                                    <SelectItem value="leads">Leads</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <Button type="submit" className="w-full h-11 rounded-xl bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20" disabled={loading}>
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Create User"}
                    </Button>
                </form>
                </CardContent>
            </Card>
         )}
      </div>
    </DashboardLayout>
  );
};

export default CreateUser;
