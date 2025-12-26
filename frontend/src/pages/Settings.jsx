import { useState } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import { ModeToggle } from "@/components/mode-toggle";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "../app/AuthContext";
import axios from "../api/axios";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Settings = () => {
    const { user } = useAuth();
    const [name, setName] = useState(user?.name || "");
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        try {
            setLoading(true);
            const response = await axios.put("/api/auth/profile", { name });
            toast.success("Profile updated!");
            // Ideally update context here, but for now reload to reflect
            setTimeout(() => window.location.reload(), 1000);
        } catch (error) {
            toast.error("Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl mx-auto">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Settings</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your account settings and preferences.</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="bg-white dark:bg-slate-800 p-1 h-12 rounded-xl border border-slate-200 dark:border-slate-700">
            <TabsTrigger value="profile" className="rounded-lg data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-600 dark:data-[state=active]:bg-indigo-500/20 dark:data-[state=active]:text-indigo-400">Profile</TabsTrigger>
            <TabsTrigger value="appearance" className="rounded-lg data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-600 dark:data-[state=active]:bg-indigo-500/20 dark:data-[state=active]:text-indigo-400">Appearance</TabsTrigger>
            <TabsTrigger value="notifications" className="rounded-lg data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-600 dark:data-[state=active]:bg-indigo-500/20 dark:data-[state=active]:text-indigo-400">Notifications</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card className="border-none shadow-dribbble dark:bg-slate-800">
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your profile details here.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-6">
                  <Avatar className="h-20 w-20 ring-4 ring-indigo-50 dark:ring-slate-700">
                    <AvatarImage src="/avatars/01.png" />
                    <AvatarFallback className="bg-indigo-600 text-white text-xl font-bold">{user?.name?.[0]}</AvatarFallback>
                  </Avatar>
                  <Button variant="outline" className="rounded-xl border-slate-200 dark:border-slate-700" onClick={() => toast("Avatar upload requires cloud storage setup")}>Change Avatar</Button>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="h-11 rounded-xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" defaultValue={user?.email} disabled className="h-11 rounded-xl bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 opacity-75 cursor-not-allowed" />
                  </div>
                  <div className="space-y-2">
                     <Label htmlFor="role">Role</Label>
                     <Input id="role" defaultValue={user?.role} disabled className="h-11 rounded-xl bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 opacity-75 cursor-not-allowed capitalize" />
                  </div>
                </div>
                <div className="flex justify-end pt-4">
                  <Button onClick={handleSave} disabled={loading} className="bg-primary hover:bg-primary/90 text-white rounded-xl h-11 px-8 shadow-lg shadow-primary/25">
                      {loading ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appearance">
            <Card className="border-none shadow-dribbble dark:bg-slate-800">
              <CardHeader>
                <CardTitle>Appearance</CardTitle>
                <CardDescription>Customize the look and feel of the application.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
                    <div className="space-y-1">
                        <h4 className="font-medium text-sm">Theme Preference</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Toggle between Light and Dark modes.</p>
                    </div>
                    <div className="flex items-center gap-2">
                       <ModeToggle />
                    </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
           <TabsContent value="notifications">
            <Card className="border-none shadow-dribbble dark:bg-slate-800">
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>Configure how you receive alerts.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-center py-12 text-slate-500 dark:text-slate-400">
                  <p>Notification settings coming soon!</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
