const Task = require("../models/taskModel");

// Create a new task
const createTask = async (req, res) => {
    try {
        const userId = req.user._id; // Make sure you're getting the user ID from the authenticated user
        const task = new Task({ ...req.body, createdBy: userId });  // req.user is set by auth middleware
        await task.save();
        res.status(201).json({task});
    } catch (error) {
        console.error("Error details:", error);  // Log the error
        res.status(500).json({ message: "Error creating task", error: error.message });
    }
};


// Get all tasks for the authenticated user
const getTasks = async (req, res) => {
    try {
        const userId = req.user._id; // Make sure you're getting the user ID from the authenticated user
        console.log('Authenticated User:', req.user); // Debugging log
        const tasks = await Task.find({ createdBy: userId }).select('title description priority status labels');;
        res.json(tasks);
    } catch (error) {
        console.error('Error fetching tasks:', error); // Log errors for debugging
        res.status(500).json({ message: "Error fetching tasks" });
    }
};



// Update a task
const updateTask = async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!task) return res.status(404).json({ message: "Task not found" });
        res.json(task);
    } catch (error) {
        res.status(500).json({ message: "Error updating task" });
    }
};

// Delete a task
const deleteTask = async (req, res) => {
    try {
        const userId = req.user._id; // Make sure you're getting the user ID from the authenticated user
        // Find the task by ID and ensure it belongs to the authenticated user
        const task = await Task.findByIdAndDelete({
            _id: req.params.id, // Task ID from the request parameters
            createdBy: userId, // // Ensure the task belongs to the logged-in user 
        });
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        } 
        res.json({ message: "Task deleted" });
    } catch (error) {
        console.error("Error deleting task:", error); // Log the error for debugging
        res.status(500).json({ message: "Error deleting task" });
    }
};

module.exports = { createTask, getTasks, updateTask, deleteTask };