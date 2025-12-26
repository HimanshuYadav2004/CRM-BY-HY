import Task from "../models/Task.js";

// Get tasks for the logged-in user
export const getTasks = async (req, res) => {
  try {
    let tasks;
    if (req.user.role === 'admin') {
        tasks = await Task.find().populate("assignedTo", "name email").sort({ createdAt: -1 });
    } else {
        tasks = await Task.find({ assignedTo: req.user._id }).sort({ createdAt: -1 });
    }
    res.status(200).json({ tasks });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Create a new task
export const createTask = async (req, res) => {
  try {
    const { title, priority, dueDate, assignedTo } = req.body;
    
    // If admin provides assignedTo, use it. Otherwise default to current user.
    let targetUserId = req.user._id;
    if (req.user.role === 'admin' && assignedTo) {
        targetUserId = assignedTo;
    }

    const task = await Task.create({
      title,
      priority,
      dueDate,
      assignedTo: targetUserId,
    });

    // Populate user details for immediate frontend display
    await task.populate("assignedTo", "name email");

    res.status(201).json({ message: "Task created", task });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Toggle task completion
export const toggleTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;
    
    let query = { _id: id };
    // If NOT admin, restrict to own tasks
    if (req.user.role !== 'admin') {
        query.assignedTo = req.user._id;
    }

    const task = await Task.findOne(query);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    task.status = task.status === "completed" ? "pending" : "completed";
    await task.save();

    // Populate for consistency in response
    await task.populate("assignedTo", "name email");

    res.status(200).json({ message: "Task updated", task });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Delete task
export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    let query = { _id: id };
    
    if (req.user.role !== 'admin') {
        query.assignedTo = req.user._id;
    }

    const result = await Task.findOneAndDelete(query);
    
    if (!result) {
        return res.status(404).json({ message: "Task not found or unauthorized" });
    }

    res.status(200).json({ message: "Task deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
