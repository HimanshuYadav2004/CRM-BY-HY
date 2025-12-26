import { useEffect, useState } from "react";
import {
  Trash2,
  Edit,
  Loader2,
  Phone,
  Mail,
  ArrowLeft,
  Search,
  Filter
} from "lucide-react";
import toast from "react-hot-toast";
import { getLeads, deleteLead } from "../api/lead.api";
import { useNavigate } from "react-router-dom";

const Leads = () => {
    const navigate = useNavigate();
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
         <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
                <button 
                    onClick={() => navigate("/admin")}
                    className="p-2 rounded-lg hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-200 transition-all text-gray-500"
                >
                    <ArrowLeft className="h-5 w-5" />
                </button>
                <div>
                   <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
                   <p className="text-sm text-gray-500">Manage your entire pipeline</p>
                </div>
            </div>
             <button 
                onClick={() => navigate("/admin/create-lead")}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm"
            >
                Add New Lead
            </button>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
             <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input 
                    type="text" 
                    placeholder="Search leads by name, email..." 
                    className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
            <div className="relative min-w-[200px]">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full pl-9 pr-8 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none bg-white cursor-pointer"
                >
                    <option value="all">All Statuses</option>
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="qualified">Qualified</option>
                    <option value="converted">Converted</option>
                    <option value="lost">Lost</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 text-xs">
                    ▼
                </div>
            </div>
        </div>

        {/* Table */}
         <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-gray-500 font-medium">
                  <tr>
                    <th className="px-6 py-3">Name</th>
                    <th className="px-6 py-3">Contact</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Source</th>
                    <th className="px-6 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredLeads.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-12 text-center">
                        <div className="mx-auto h-12 w-12 text-gray-300 mb-3">
                            <UsersIcon />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">No leads found</h3>
                        <p className="text-gray-500">
                            {searchQuery || filterStatus !== 'all' ? "Try adjusting your filters." : "Get started by adding a new lead."}
                        </p>
                      </td>
                    </tr>
                  ) : (
                    filteredLeads.map((lead) => (
                      <tr key={lead._id} className="hover:bg-gray-50 transition-colors group">
                        <td className="px-6 py-4">
                             <div className="flex items-center gap-3">
                                <div className="h-9 w-9 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-sm border border-indigo-100">
                                    {lead.name?.[0]?.toUpperCase()}
                                </div>
                                <span className="font-medium text-gray-900">{lead.name}</span>
                              </div>
                        </td>

                        <td className="px-6 py-4">
                           <div className="flex flex-col gap-1">
                               <div className="flex items-center gap-2 text-gray-600">
                                   <Mail className="h-3.5 w-3.5" />
                                   {lead.email || "-"}
                               </div>
                               {lead.phone && (
                                   <div className="flex items-center gap-2 text-gray-500 text-xs">
                                       <Phone className="h-3 w-3" />
                                       {lead.phone}
                                   </div>
                               )}
                           </div>
                        </td>

                        <td className="px-6 py-4">
                          <StatusBadge status={lead.status} />
                        </td>

                        <td className="px-6 py-4">
                          <span className="capitalize text-gray-600 bg-gray-100 px-2 py-0.5 rounded text-xs border border-gray-200">
                              {lead.source}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => navigate(`/admin/leads/edit/${lead._id}`)}
                                    className="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                                    title="Edit"
                                >
                                    <Edit className="h-4 w-4" />
                                </button>
                                <button
                                    onClick={() => handleDelete(lead._id)}
                                    className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                    title="Delete"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            
             <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 flex items-center justify-between text-xs text-gray-500">
                 <span>Showing {filteredLeads.length} leads</span>
            </div>

          </div>
       </div>
    </div>
  );
};

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

const UsersIcon = () => (
    <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
)

export default Leads;
