import { useEffect, useState } from "react";
import {
  Users,
  UserPlus,
  TrendingUp,
  TrendingDown,
  Loader2,
  MoreVertical,
  Plus,
  Search,
  Bell,
  LogOut,
  LayoutDashboard
} from "lucide-react";
import { getLeads } from "../api/lead.api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../app/AuthContext"; 

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
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

  const handleLogout = () => {
      logout();
      navigate('/login');
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-2">
                <div className="rounded-lg bg-indigo-600 p-1.5">
                    <LayoutDashboard className="h-5 w-5 text-white" />
                </div>
              <span className="font-bold text-xl tracking-tight text-gray-900">CRM</span>
            </div>
            <div className="flex items-center gap-4">
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <Bell className="h-5 w-5" />
              </button>
              <div className="h-8 w-px bg-gray-200 mx-2"></div>
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-red-600 transition-colors"
                >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Header & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
                <p className="text-sm text-gray-500 mt-1">Welcome back, here's what's happening today.</p>
            </div>
            <div className="flex items-center gap-3">
                <button 
                    onClick={() => navigate("/admin/leads")}
                    className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
                >
                    View All Leads
                </button>
                <button 
                    onClick={() => navigate("/admin/create-lead")}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm flex items-center gap-2"
                >
                    <Plus className="h-4 w-4" />
                    Create Lead
                </button>
            </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Leads"
            value={totalLeads}
            icon={<Users className="w-5 h-5 text-indigo-600" />}
            trend="+12% from last month" 
            trendUp={true}
          />
          <StatCard
            title="New Leads"
            value={newLeads}
            icon={<UserPlus className="w-5 h-5 text-blue-600" />}
             trend="+4 due today" 
             trendUp={true}
          />
          <StatCard
            title="Converted"
            value={converted}
            icon={<TrendingUp className="w-5 h-5 text-emerald-600" />}
            trend="2.4% conversion rate"
            trendUp={true}
          />
          <StatCard
            title="Lost"
            value={lost}
            icon={<TrendingDown className="w-5 h-5 text-red-600" />}
            trend="-1% from last week"
            trendUp={false}
          />
        </div>

        {/* Recent Leads Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Recent Leads</h2>
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input 
                    type="text" 
                    placeholder="Search leads..." 
                    className="pl-9 pr-4 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-500 font-medium">
                <tr>
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Source</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {leads.slice(0, 5).map((lead) => (
                  <tr key={lead._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs">
                            {lead.name.charAt(0).toUpperCase()}
                        </div>
                        {lead.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{lead.email}</td>
                    <td className="px-6 py-4">
                        <StatusBadge status={lead.status} />
                    </td>
                    <td className="px-6 py-4 text-gray-600 capitalize">{lead.source}</td>
                    <td className="px-6 py-4 text-right">
                        <button className="text-gray-400 hover:text-gray-600">
                            <MoreVertical className="h-4 w-4" />
                        </button>
                    </td>
                  </tr>
                ))}
                {leads.length === 0 && (
                    <tr>
                        <td colSpan="5" className="px-6 py-10 text-center text-gray-500">
                            No leads found. Start by creating one!
                        </td>
                    </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 flex items-center justify-between text-xs text-gray-500">
             <span>Showing {Math.min(5, leads.length)} of {totalLeads} entries</span>
             <button 
                onClick={() => navigate("/admin/leads")}
                className="text-indigo-600 font-medium hover:text-indigo-700"
             >
                View All
             </button>
          </div>
        </div>
      </main>
    </div>
  );
};

const StatCard = ({ title, value, icon, trend, trendUp }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between mb-4">
        <div className="p-2 bg-gray-50 rounded-lg">
            {icon}
        </div>
      {trend && (
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${trendUp ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              {trendUp ? '↑' : '↓'} 2.5%
          </span>
      )}
    </div>
    <div>
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <h3 className="text-2xl font-bold text-gray-900 mt-1">{value}</h3>
      <p className="text-xs text-gray-400 mt-1">{trend}</p>
    </div>
  </div>
);

const StatusBadge = ({ status }) => {
    const styles = {
        new: "bg-blue-50 text-blue-700 border-blue-100",
        contacted: "bg-yellow-50 text-yellow-700 border-yellow-100",
        qualified: "bg-indigo-50 text-indigo-700 border-indigo-100",
        converted: "bg-emerald-50 text-emerald-700 border-emerald-100",
        lost: "bg-red-50 text-red-700 border-red-100"
    };
    
    const defaultStyle = "bg-gray-50 text-gray-700 border-gray-100";
    const statusKey = status?.toLowerCase() || 'new';

    return (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[statusKey] || defaultStyle} capitalize`}>
            {status}
        </span>
    );
};

export default AdminDashboard;
