import { useState, useEffect } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import axios from "../api/axios";
import toast from "react-hot-toast";
import { Plus, CheckCircle2, Circle, Trash2, Calendar, User } from "lucide-react";
import { useAuth } from "../app/AuthContext";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const Tasks = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]); // For Admin assignment
  const [newTask, setNewTask] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      const response = await axios.get("/api/tasks");
      setTasks(response.data.tasks);
    } catch (error) {
      console.error("Failed to fetch tasks", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
      if (!isAdmin) return;
      try {
          const response = await axios.get("/api/admin/users");
          setUsers(response.data.users);
      } catch (error) {
          console.error("Failed to fetch users", error);
      }
  };

  useEffect(() => {
    fetchTasks();
    if (isAdmin) {
        fetchUsers();
    }
  }, [isAdmin]);

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    try {
      const payload = {
        title: newTask,
        priority: "medium",
        dueDate: new Date()
      };
      
      if (isAdmin && assignedTo) {
          payload.assignedTo = assignedTo;
      }

      const response = await axios.post("/api/tasks", payload);
      setTasks([response.data.task, ...tasks]);
      setNewTask("");
      setAssignedTo(""); // Reset assignment
      toast.success("Task added");
    } catch (error) {
      toast.error("Failed to add task");
    }
  };

  const handleToggle = async (id) => {
    // Optimistic update
    const updatedTasks = tasks.map(t => 
        t._id === id ? { ...t, status: t.status === "completed" ? "pending" : "completed" } : t
    );
    setTasks(updatedTasks);

    try {
      await axios.patch(`/api/tasks/${id}/toggle`);
    } catch (error) {
      toast.error("Failed to update task");
      fetchTasks(); // Revert on error
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/tasks/${id}`);
      setTasks(tasks.filter(t => t._id !== id));
      toast.success("Task deleted");
    } catch (error) {
      toast.error("Failed to delete task");
    }
  };

  const completedCount = tasks.filter(t => t.status === "completed").length;

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
           <h2 className="text-3xl font-bold tracking-tight text-slate-900">My Tasks</h2>
           <p className="text-slate-500 mt-1">Keep track of your daily activities.</p>
        </div>

        <Card className="border-none shadow-dribbble rounded-[2rem] overflow-hidden bg-white">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-6">
                <form onSubmit={handleAddTask} className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 flex gap-4">
                        <Input 
                            placeholder="Add a new task..." 
                            value={newTask}
                            onChange={(e) => setNewTask(e.target.value)}
                            className="h-12 rounded-xl bg-white border-slate-200 shadow-sm flex-1"
                        />
                         {isAdmin && (
                            <div className="w-[200px]">
                                <Select value={assignedTo} onValueChange={setAssignedTo}>
                                    <SelectTrigger className="h-12 rounded-xl bg-white border-slate-200 shadow-sm">
                                        <SelectValue placeholder="Assign to..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="self">Myself</SelectItem>
                                        {users.map(u => (
                                            <SelectItem key={u._id} value={u._id}>{u.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                    </div>
                    <Button type="submit" className="h-12 px-6 rounded-xl bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25">
                        <Plus className="mr-2 h-4 w-4" /> Add
                    </Button>
                </form>
            </CardHeader>
            <CardContent className="p-0">
                {loading ? (
                    <div className="p-8 text-center text-slate-500">Loading tasks...</div>
                ) : tasks.length === 0 ? (
                    <div className="p-12 text-center text-slate-500 flex flex-col items-center">
                        <div className="h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-300">
                             <CheckCircle2 className="h-8 w-8" />
                        </div>
                        <p>No tasks yet. Add one above!</p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-100">
                        {tasks.map((task) => (
                            <div key={task._id} className="flex items-center justify-between p-4 hover:bg-slate-50/50 transition-colors group">
                                <div className="flex items-center gap-4 flex-1">
                                    <button onClick={() => handleToggle(task._id)} className="text-slate-400 hover:text-primary transition-colors">
                                        {task.status === "completed" ? (
                                            <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                                        ) : (
                                            <Circle className="h-6 w-6" />
                                        )}
                                    </button>
                                    <span className={`text-base font-medium ${task.status === "completed" ? "text-slate-400 line-through" : "text-slate-700"}`}>
                                        {task.title}
                                    </span>
                                </div>
                                <div className="flex items-center gap-4">
                                     {isAdmin && task.assignedTo && (
                                         <Badge variant="secondary" className="hidden sm:flex items-center gap-1 font-normal text-slate-500 bg-slate-100">
                                            <User className="h-3 w-3" />
                                            {typeof task.assignedTo === 'object' ? task.assignedTo.name : 'User'}
                                         </Badge>
                                     )}
                                     {task.priority === "high" && <Badge variant="destructive" className="rounded-md">High</Badge>}
                                     <span className="text-xs text-slate-400 flex items-center gap-1">
                                        <Calendar className="h-3 w-3" />
                                        {new Date(task.dueDate).toLocaleDateString()}
                                     </span>
                                     <Button variant="ghost" size="icon" onClick={() => handleDelete(task._id)} className="text-slate-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                         <Trash2 className="h-4 w-4" />
                                     </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
             <div className="bg-slate-50 p-4 text-xs text-slate-500 font-medium border-t border-slate-100 flex justify-between">
                <span>{completedCount} / {tasks.length} completed</span>
            </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Tasks;
