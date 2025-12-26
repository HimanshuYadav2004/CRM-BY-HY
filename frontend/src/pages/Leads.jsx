import { useEffect, useState } from "react";
import {
  Trash2,
  Edit,
  Loader2,
  Phone,
  Mail,
  Plus,
  Search,
  MoreVertical
} from "lucide-react";
import toast from "react-hot-toast";
import { getLeads, deleteLead } from "../api/lead.api";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout";
import { useAuth } from "../app/AuthContext";

// shadcn components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";


const Leads = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const isAdmin = user?.role === 'admin';

  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const fetchLeads = async () => {
    try {
      const data = await getLeads();
      setLeads(data);
    } catch (err) {
      console.error("Failed to fetch leads:", err);
      toast.error("Failed to load leads");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleDelete = async (id) => {
    if (!isAdmin) return;
    
    if (window.confirm("Are you sure you want to delete this lead? This action cannot be undone.")) {
      try {
        await deleteLead(id);
        setLeads((prev) => prev.filter((l) => l._id !== id));
        toast.success("Lead deleted successfully");
      } catch (err) {
        console.error("Failed to delete lead:", err);
        toast.error("Failed to delete lead");
      }
    }
  };

  const filteredLeads = leads.filter((lead) => {
      const matchesSearch = 
        lead.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.email?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = filterStatus === "all" || lead.status?.toLowerCase() === filterStatus.toLowerCase();

      return matchesSearch && matchesStatus;
  });

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
                  <h2 className="text-3xl font-bold tracking-tight text-slate-900">Leads</h2>
                  <p className="text-slate-500 mt-1">Manage your pipeline and prospects.</p>
                </div>
                <Button onClick={() => navigate("/dashboard/create-lead")} className="h-11 rounded-xl bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25">
                    <Plus className="mr-2 h-4 w-4" /> Add Lead
                </Button>
            </div>

            <div className="flex items-center gap-4">
                 <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                        type="search"
                        placeholder="Search leads..."
                        className="pl-10 h-11 rounded-xl bg-white border-0 shadow-sm ring-1 ring-slate-200 focus-visible:ring-indigo-500"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                 </div>
                 <div className="w-[180px]">
                     <Select value={filterStatus} onValueChange={setFilterStatus}>
                        <SelectTrigger className="h-11 rounded-xl bg-white border-0 shadow-sm ring-1 ring-slate-200 focus:ring-indigo-500">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-slate-100 shadow-xl">
                            <SelectItem value="all">All Statuses</SelectItem>
                            <SelectItem value="new">New</SelectItem>
                            <SelectItem value="contacted">Contacted</SelectItem>
                            <SelectItem value="qualified">Qualified</SelectItem>
                            <SelectItem value="converted">Converted</SelectItem>
                            <SelectItem value="lost">Lost</SelectItem>
                        </SelectContent>
                     </Select>
                 </div>
            </div>

             <Card className="border-none shadow-dribbble rounded-[2rem] overflow-hidden bg-white">
                 <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-b border-slate-100 hover:bg-transparent">
                                <TableHead className="pl-6 py-4">Name</TableHead>
                                <TableHead className="py-4">Contact</TableHead>
                                <TableHead className="py-4">Status</TableHead>
                                <TableHead className="py-4">Source</TableHead>
                                <TableHead className="pr-6 py-4 text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredLeads.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center text-slate-500">
                                        No results found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredLeads.map((lead) => (
                                    <TableRow key={lead._id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                                        <TableCell className="pl-6 py-4 font-medium">
                                            <div className="flex items-center gap-3">
                                                <div className="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600 shadow-inner">
                                                    {lead.name?.[0]?.toUpperCase()}
                                                </div>
                                                <span className="text-slate-700">{lead.name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-4">
                                            <div className="flex flex-col text-sm">
                                                <span className="flex items-center gap-1 text-slate-900">
                                                    <Mail className="h-3 w-3 text-slate-400" /> {lead.email || "-"}
                                                </span>
                                                {lead.phone && (
                                                    <span className="flex items-center gap-1 text-slate-500 mt-0.5">
                                                        <Phone className="h-3 w-3" /> {lead.phone}
                                                    </span>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-4">
                                            <StatusBadge status={lead.status} />
                                        </TableCell>
                                        <TableCell className="py-4 capitalize text-slate-500">
                                            {lead.source}
                                        </TableCell>
                                        <TableCell className="pr-6 py-4 text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0 rounded-full hover:bg-slate-100 text-slate-400">
                                                        <span className="sr-only">Open menu</span>
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="rounded-xl shadow-xl border-slate-100 p-2">
                                                    <DropdownMenuItem onClick={() => navigate(`/dashboard/leads/edit/${lead._id}`)} className="rounded-lg cursor-pointer hover:bg-slate-50">
                                                        <Edit className="mr-2 h-4 w-4" /> Edit
                                                    </DropdownMenuItem>
                                                    {isAdmin && (
                                                        <>
                                                            <DropdownMenuSeparator className="bg-slate-100 my-1" />
                                                            <DropdownMenuItem 
                                                                onClick={() => handleDelete(lead._id)}
                                                                className="text-red-600 focus:text-red-600 focus:bg-red-50 rounded-lg cursor-pointer"
                                                            >
                                                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                                                            </DropdownMenuItem>
                                                        </>
                                                    )}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
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

const StatusBadge = ({ status }) => {
    const customClasses = {
        new: "bg-blue-50 text-blue-700 ring-1 ring-blue-500/20",
        contacted: "bg-amber-50 text-amber-700 ring-1 ring-amber-500/20",
        qualified: "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-500/20",
        converted: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-500/20",
        lost: "bg-rose-50 text-rose-700 ring-1 ring-rose-500/20"
    }

    return (
        <Badge variant="outline" className={`capitalize font-normal border-0 ${customClasses[status] || ""}`}>
            {status}
        </Badge>
    );
};

export default Leads;
