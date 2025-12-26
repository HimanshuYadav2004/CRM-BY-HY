import { useEffect, useState } from "react";
import {
  Users,
  UserPlus,
  TrendingUp,
  TrendingDown,
  Loader2,
  MoreHorizontal,
  Plus,
  ArrowRight,
  Filter
} from "lucide-react";
import { getLeads } from "../api/lead.api";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
} from "@/components/ui/dropdown-menu";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const data = await getLeads();
        setLeads(data);
      } catch (err) {
        console.error("Failed to fetch leads", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, []);

  const totalLeads = leads.length;
  const newLeads = leads.filter((l) => l.status === "new").length;
  const converted = leads.filter((l) => l.status?.toLowerCase() === "converted").length;
  const lost = leads.filter((l) => l.status?.toLowerCase() === "lost").length;

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
      <div className="space-y-10">
        
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
             <div>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Dashboard Overview</h1>
                <p className="text-slate-500 mt-2">Track your team's performance and lead pipeline.</p>
             </div>
             <div className="flex items-center gap-3">
                 <Button variant="outline" className="h-11 rounded-xl bg-white border-0 shadow-sm hover:bg-slate-50 text-slate-600">
                    <Filter className="mr-2 h-4 w-4" /> Filter
                 </Button>
                 <Button onClick={() => navigate("/dashboard/create-lead")} className="h-11 rounded-xl bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25 px-6">
                    <Plus className="mr-2 h-5 w-5" /> Add New Lead
                 </Button>
             </div>
        </div>

        {/* Stats Grid - "Floating Bubbles" */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <StatsCard 
                title="Total Leads" 
                value={totalLeads} 
                icon={<Users className="h-6 w-6 text-white" />}
                trend="+12%"
                trendUp={true}
                color="bg-indigo-500"
                shadow="shadow-indigo-500/20"
            />
            <StatsCard 
                title="New Leads" 
                value={newLeads} 
                icon={<UserPlus className="h-6 w-6 text-white" />}
                trend="+4 today"
                trendUp={true}
                color="bg-blue-500"
                shadow="shadow-blue-500/20"
            />
             <StatsCard 
                title="Converted" 
                value={converted} 
                icon={<TrendingUp className="h-6 w-6 text-white" />}
                trend="2.4% rate"
                trendUp={true}
                color="bg-emerald-500"
                shadow="shadow-emerald-500/20"
            />
             <StatsCard 
                title="Lost Deals" 
                value={lost} 
                icon={<TrendingDown className="h-6 w-6 text-white" />}
                trend="-1.2%"
                trendUp={false}
                color="bg-rose-500"
                shadow="shadow-rose-500/20"
            />
        </div>

        {/* Main Content - "Floating Paper" */}
        <div className="grid gap-8 lg:grid-cols-3">
             {/* Recent Leads Table */}
             <Card className="col-span-2 border-none shadow-dribbble rounded-[2rem] overflow-hidden bg-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 p-8 pb-6">
                    <div className="space-y-1">
                        <CardTitle className="text-xl font-bold text-slate-900">Recent Leads</CardTitle>
                        <CardDescription className="text-slate-500 font-medium">
                            Latest activity from your pipeline.
                        </CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-b border-slate-100 hover:bg-transparent">
                                <TableHead className="pl-8 py-5 text-xs font-bold uppercase tracking-wider text-slate-400">Prospect</TableHead>
                                <TableHead className="py-5 text-xs font-bold uppercase tracking-wider text-slate-400">Contact</TableHead>
                                <TableHead className="py-5 text-xs font-bold uppercase tracking-wider text-slate-400">Status</TableHead>
                                <TableHead className="pr-8 py-5 text-right text-xs font-bold uppercase tracking-wider text-slate-400">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {leads.slice(0, 5).map((lead) => (
                                <TableRow key={lead._id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-all duration-200">
                                    <TableCell className="pl-8 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-sm font-bold text-slate-600 shadow-inner">
                                                {lead.name?.[0]?.toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="font-bold text-slate-800">{lead.name}</div>
                                                <div className="text-xs text-slate-400 font-medium capitalize">{lead.source}</div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-5 font-medium text-slate-500">{lead.email}</TableCell>
                                    <TableCell className="py-5">
                                        <StatusBadge status={lead.status} />
                                    </TableCell>
                                    <TableCell className="pr-8 py-5 text-right">
                                         <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600">
                                                    <span className="sr-only">Open menu</span>
                                                    <MoreHorizontal className="h-5 w-5" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="rounded-2xl shadow-xl border-0 p-2 min-w-[160px]">
                                                <DropdownMenuItem onClick={() => navigate(`/dashboard/leads/edit/${lead._id}`)} className="rounded-xl py-2 cursor-pointer font-medium hover:bg-slate-50 text-slate-600">
                                                    Edit Details
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => navigate("/dashboard/leads")} className="rounded-xl py-2 cursor-pointer font-medium hover:bg-slate-50 text-slate-600">
                                                    View History
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
                <div className="p-8 pt-4 border-t border-slate-50">
                    <Button variant="ghost" onClick={() => navigate("/dashboard/leads")} className="w-full justify-center text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 font-semibold h-11 rounded-xl">
                        View All Leads <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>
             </Card>

             {/* Side Stats / Activity or whatever */}
             <Card className="col-span-1 border-none shadow-dribbble rounded-[2rem] bg-gradient-to-br from-indigo-600 to-purple-700 text-white overflow-hidden relative">
                 <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                 <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none"></div>
                 
                 <CardHeader className="relative z-10 p-8">
                     <CardTitle className="text-2xl font-bold">Pro Tips</CardTitle>
                     <CardDescription className="text-indigo-100 opacity-90">
                         Boost your conversion rates by following up within 24 hours.
                     </CardDescription>
                 </CardHeader>
                 <CardContent className="relative z-10 p-8 pt-0 space-y-6">
                     <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/5">
                         <h4 className="font-semibold text-lg flex items-center gap-2">
                             <TrendingUp className="h-5 w-5 text-emerald-300" /> +24%
                         </h4>
                         <p className="text-sm text-indigo-100 mt-1">Lead response rate this week.</p>
                     </div>
                     <Button className="w-full bg-white text-indigo-700 hover:bg-indigo-50 border-0 h-11 rounded-xl font-bold shadow-lg">
                         Read More
                     </Button>
                 </CardContent>
             </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

const StatsCard = ({ title, value, icon, trend, trendUp, color, shadow }) => (
    <div className="bg-white p-6 rounded-[2rem] shadow-float hover:shadow-dribbble transition-all duration-300 hover:-translate-y-1">
        <div className="flex items-start justify-between mb-4">
             <div className={`p-3.5 rounded-2xl ${color} ${shadow} shadow-lg`}>
                {icon}
             </div>
             <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${trendUp ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                {trend}
             </span>
        </div>
        <div>
            <div className="text-3xl font-bold text-slate-900 tracking-tight mb-1">{value}</div>
            <div className="text-slate-400 text-sm font-medium">{title}</div>
        </div>
    </div>
);

const StatusBadge = ({ status }) => {
    const styles = {
        new: "bg-blue-50 text-blue-600 ring-1 ring-blue-500/20",
        contacted: "bg-amber-50 text-amber-600 ring-1 ring-amber-500/20",
        qualified: "bg-indigo-50 text-indigo-600 ring-1 ring-indigo-500/20",
        converted: "bg-emerald-50 text-emerald-600 ring-1 ring-emerald-500/20",
        lost: "bg-rose-50 text-rose-600 ring-1 ring-rose-500/20"
    }

    return (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold capitalize ${styles[status]}`}>
            {status}
        </span>
    );
};

export default AdminDashboard;
