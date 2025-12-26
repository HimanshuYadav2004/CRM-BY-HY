import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  PlusCircle,
  Menu,
  LogOut,
  User,
  Settings,
  Command,
  PieChart,
  Bell,
  Search,
  CheckCircle2
} from "lucide-react";
import { ModeToggle } from "../mode-toggle";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "../../app/AuthContext";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";

const NavItem = ({ to, icon: Icon, children }) => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;
  
  return (
    <Link to={to}>
      <Button 
        variant="ghost" 
        className={`w-full justify-start h-12 px-4 mb-2 rounded-2xl transition-all duration-300 ${
            isActive(to) 
            ? "bg-primary text-white shadow-lg shadow-primary/30" 
            : "text-slate-400 hover:bg-slate-800 hover:text-white"
        }`}
      >
        <Icon className={`mr-3 h-5 w-5 ${isActive(to) ? "text-white" : "text-slate-500 group-hover:text-white"}`} />
        <span className="font-medium tracking-wide">{children}</span>
      </Button>
    </Link>
  );
};

const Sidebar = ({ className }) => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  return (
    <div className={`pb-12 min-h-screen ${className} bg-[#0F172A] text-white`}>
      <div className="space-y-8 py-8 px-6">
        {/* Logo Area */}
        <div className="flex items-center gap-3 px-2 mb-8">
            <div className="h-10 w-10 rounded-xl bg-indigo-500 flex items-center justify-center shadow-indigo-500/20 shadow-lg">
                 <Command className="h-6 w-6 text-white" />
            </div>
             <div>
                <h1 className="font-bold text-xl tracking-wide text-white leading-none">Acme CRM</h1>
                <p className="text-xs text-slate-500 font-medium mt-1">CRM Suite</p>
             </div>
        </div>
        
        {/* Navigation */}
        <div className="space-y-1">
          <h2 className="mb-4 px-4 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
             Menu
          </h2>
          <NavItem to="/dashboard" icon={LayoutDashboard}>Dashboard</NavItem>
          <NavItem to="/dashboard/leads" icon={Users}>Leads</NavItem>
          {isAdmin && <NavItem to="/dashboard/team" icon={Users}>Team</NavItem>}
          {isAdmin && <NavItem to="/dashboard/analytics" icon={PieChart}>Analytics</NavItem>}
        </div>

        <div className="space-y-1">
           <h2 className="mb-4 px-4 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
            Operations
          </h2>
           <NavItem to="/dashboard/tasks" icon={CheckCircle2}>My Tasks</NavItem>
           <NavItem to="/dashboard/create-lead" icon={PlusCircle}>Add Lead</NavItem>
           {isAdmin && <NavItem to="#" icon={Settings}>Settings</NavItem>}
        </div>
        
        {/* Pro Card - Only for Admin? Or show for all? */}
        <div className="mt-auto pt-8 px-2">
             <div className="p-5 bg-slate-800/50 rounded-3xl border border-slate-700/50 relative overflow-hidden backdrop-blur-sm">
                <div className="absolute top-0 right-0 p-3 opacity-20">
                    <PieChart className="w-24 h-24 text-indigo-500" />
                </div>
                <h3 className="font-semibold text-white z-10 relative text-sm">Pro Plan</h3>
                <p className="text-xs text-slate-400 mt-1 mb-4 z-10 relative leading-relaxed">Unlock advanced analytics and more seats.</p>
                <Button size="sm" className="w-full bg-white text-slate-900 hover:bg-slate-100 z-10 relative font-semibold shadow-none border-0 h-9 rounded-xl">
                    Upgrade Now
                </Button>
             </div>
        </div>
      </div>
    </div>
  );
};

const DashboardLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-[#F1F5F9]">
      {/* Desktop Sidebar (Fixed, Dark) */}
      <aside className="hidden w-72 lg:block fixed h-full z-10 bg-[#0F172A] border-r border-[#1E293B]">
        <Sidebar className="h-full" />
      </aside>

      {/* Main Content Wrapper */}
      <div className="flex-1 lg:pl-72 flex flex-col min-h-screen transition-all duration-300 bg-[#F1F5F9]">
        {/* Header - Floating, Transparent-ish */}
        <header className="sticky top-0 z-20 flex h-24 items-center gap-4 bg-[#F1F5F9]/80 backdrop-blur-xl px-8 justify-between">
           <div className="flex items-center gap-4 flex-1">
                <Sheet>
                    <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="lg:hidden -ml-2 text-slate-800">
                        <Menu className="h-6 w-6" />
                    </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-72 p-0 border-r-0 bg-[#0F172A]">
                        <Sidebar className="bg-[#0F172A]" />
                    </SheetContent>
                </Sheet>
                
                {/* Search Bar - styled like Dribbble */}
                <div className="max-w-md w-full relative hidden md:block group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                    <Input 
                        placeholder="Search for leads, companies..." 
                        className="pl-10 h-12 rounded-2xl border-none bg-white shadow-sm ring-1 ring-slate-200/50 focus-visible:ring-indigo-500/30 text-slate-600 transition-all placeholder:text-slate-400" 
                    />
                </div>
           </div>

           <div className="flex items-center gap-6">
                <Button variant="ghost" size="icon" className="relative text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 rounded-xl">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-3 right-3 h-2 w-2 rounded-full bg-red-500 border-2 border-white"></span>
                </Button>
                
                <ModeToggle />

                {/* User Profile */}
                <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-12 w-12 rounded-full ring-2 ring-white shadow-lg hover:shadow-xl transition-all p-0 overflow-hidden group">
                        <Avatar className="h-full w-full group-hover:scale-105 transition-transform duration-300">
                            <AvatarImage src="/avatars/01.png" alt="Admin" />
                            <AvatarFallback className="bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-bold">
                                {user?.name?.[0]?.toUpperCase() || "A"}
                            </AvatarFallback>
                        </Avatar>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64 mt-3 mr-2 p-2 rounded-2xl shadow-xl border-slate-100" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal p-3 bg-slate-50/50 rounded-xl mb-1">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-semibold leading-none text-slate-900">{user?.name || "Admin"}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                        {user?.email || "admin@example.com"}
                        </p>
                        <p className="text-[10px] uppercase font-bold text-indigo-500 mt-1">{user?.role || "USER"}</p>
                    </div>
                    </DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => navigate("/dashboard/settings")} className="rounded-xl mt-1 py-2.5 cursor-pointer text-slate-600 focus:text-indigo-600 focus:bg-indigo-50 dark:text-slate-300 dark:focus:text-white dark:focus:bg-indigo-500/20">
                    <User className="mr-3 h-4 w-4" />
                    <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/dashboard/settings")} className="rounded-xl py-2.5 cursor-pointer text-slate-600 focus:text-indigo-600 focus:bg-indigo-50 dark:text-slate-300 dark:focus:text-white dark:focus:bg-indigo-500/20">
                        <Settings className="mr-3 h-4 w-4" />
                        <span>Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="my-1 bg-slate-100" />
                    <DropdownMenuItem onClick={handleLogout} className="rounded-xl py-2.5 cursor-pointer text-rose-500 focus:text-rose-600 focus:bg-rose-50">
                    <LogOut className="mr-3 h-4 w-4" />
                    <span>Log out</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
                </DropdownMenu>
           </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 px-8 pb-8">
            <div className="mx-auto max-w-[1600px] animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
                {children}
            </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
