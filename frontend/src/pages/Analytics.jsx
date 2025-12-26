import { useEffect, useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import axios from '../api/axios';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, TrendingUp, Users, CheckCircle } from 'lucide-react';
import { 
    BarChart, 
    Bar, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer, 
    PieChart, 
    Pie, 
    Cell,
    Legend
} from 'recharts';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const Analytics = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const response = await axios.get('/api/admin/analytics');
                setData(response.data);
            } catch (error) {
                console.error("Failed to fetch analytics", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, []);

    if (loading) {
        return (
            <DashboardLayout>
                <div className="flex h-[80vh] items-center justify-center">
                    <Loader2 className="w-12 h-12 text-primary animate-spin opacity-50" />
                </div>
            </DashboardLayout>
        );
    }

    // Format Data for Charts
    const statusData = data?.leadsByStatus.map(item => ({ name: item._id, value: item.count })) || [];
    const sourceData = data?.leadsBySource.map(item => ({ name: item._id, value: item.count })) || [];

    return (
        <DashboardLayout>
            <div className="space-y-8">
                <div>
                  <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Analytics Overview</h2>
                  <p className="text-slate-500 dark:text-slate-400 mt-1">Real-time insights into your performance.</p>
                </div>

                {/* KPI Cards */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Card className="shadow-float border-none dark:bg-slate-800">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                           <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
                           <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                           <div className="text-2xl font-bold">{data?.totalLeads}</div>
                           <p className="text-xs text-muted-foreground">+12% from last month</p>
                        </CardContent>
                    </Card>
                    <Card className="shadow-float border-none dark:bg-slate-800">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                           <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                           <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                           <div className="text-2xl font-bold">
                               {data?.totalLeads > 0 
                                ? Math.round((statusData.find(s => s.name === "converted")?.value || 0) / data.totalLeads * 100) 
                                : 0}%
                           </div>
                           <p className="text-xs text-muted-foreground">+2.5% from last month</p>
                        </CardContent>
                    </Card>
                    <Card className="shadow-float border-none dark:bg-slate-800">
                         <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                           <CardTitle className="text-sm font-medium">Task Completion</CardTitle>
                           <CheckCircle className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                           <div className="text-2xl font-bold">{data?.tasks.completed} / {data?.tasks.total}</div>
                           <p className="text-xs text-muted-foreground">Pending: {data?.tasks.pending}</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Charts Area */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                    
                    {/* Bar Chart - Leads by Source */}
                    <Card className="col-span-4 shadow-dribbble border-none dark:bg-slate-800">
                        <CardHeader>
                            <CardTitle>Leads by Source</CardTitle>
                            <CardDescription>Where are your leads coming from?</CardDescription>
                        </CardHeader>
                        <CardContent className="pl-2">
                            <ResponsiveContainer width="100%" height={350}>
                                <BarChart data={sourceData}>
                                    <CartesianGrid strokeDasharray="3 3" className="stroke-slate-100 dark:stroke-slate-700" vertical={false} />
                                    <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} className="capitalize" />
                                    <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                                    <Tooltip 
                                        cursor={{fill: 'transparent'}}
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} 
                                    />
                                    <Bar dataKey="value" fill="currentColor" radius={[4, 4, 0, 0]} className="fill-primary" barSize={40} />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Pie Chart - Leads by Status */}
                    <Card className="col-span-3 shadow-dribbble border-none dark:bg-slate-800">
                        <CardHeader>
                            <CardTitle>Lead Status Distribution</CardTitle>
                            <CardDescription>Current state of your pipeline.</CardDescription>
                        </CardHeader>
                         <CardContent>
                            <ResponsiveContainer width="100%" height={350}>
                                <PieChart>
                                    <Pie
                                        data={statusData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={100}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {statusData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend iconType="circle" />
                                </PieChart>
                            </ResponsiveContainer>
                         </CardContent>
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Analytics;
