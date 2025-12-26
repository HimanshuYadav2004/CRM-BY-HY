import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Loader2, User, Mail, Phone, Globe, FileText } from "lucide-react";
import toast from "react-hot-toast";
import { createLead } from "../api/lead.api";

const CreateLead = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    source: "website",
    notes: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await createLead(formData);
      toast.success("Lead created successfully");
      navigate("/admin/leads");
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || "Failed to create lead";
      toast.error(msg);
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4 sm:px-6 lg:px-8 font-sans text-gray-900">
        
       <div className="w-full max-w-2xl">
        {/* Header Link */}
        <button
          onClick={() => navigate(-1)}
          className="mb-8 flex items-center text-gray-500 hover:text-gray-900 transition-colors font-medium text-sm"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Leads
        </button>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-200 bg-gray-50/50">
                <h1 className="text-xl font-bold text-gray-900">Create New Lead</h1>
                <p className="text-sm text-gray-500 mt-1">Fill in the information below to add a new prospect.</p>
            </div>
          
           <div className="p-8">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                     <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors placeholder-gray-400 text-sm"
                    placeholder="e.g. John Doe"
                    />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Email */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors placeholder-gray-400 text-sm"
                        placeholder="john@example.com"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Phone
                  </label>
                   <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors placeholder-gray-400 text-sm"
                        placeholder="+1 (555) 000-0000"
                    />
                   </div>
                </div>
              </div>

              {/* Source */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  Source
                </label>
                 <div className="relative">
                   <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <select
                        name="source"
                        value={formData.source}
                        onChange={handleChange}
                        className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-white appearance-none text-sm cursor-pointer"
                    >
                    <option value="website">Website</option>
                    <option value="call">Call</option>
                    <option value="email">Email</option>
                    <option value="referral">Referral</option>
                    <option value="ads">Ads</option>
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 text-xs">
                        ▼
                    </div>
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  Notes
                </label>
                 <div className="relative">
                     <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows="4"
                    className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors placeholder-gray-400 text-sm resize-none"
                    placeholder="Add any relevant notes here..."
                    ></textarea>
                 </div>
              </div>

              {/* Actions */}
              <div className="pt-4 flex items-center justify-end gap-3">
                 <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-all shadow-sm"
                  >
                    {loading ? (
                    <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Saving...
                    </>
                    ) : (
                    <>
                        <Save className="w-4 h-4" />
                        Create Lead
                    </>
                    )}
                  </button>
              </div>
            </form>
           </div>
        </div>
      </div>
    </div>
  );
};

export default CreateLead;
