const express = require("express");
const { createTask, getTasks, updateTask, deleteTask } = require("../controllers/taskController");
const authMiddleware = require("../middleware/authMiddleware");  // Ensure routes are protected
const router = express.Router();

// Route to create a new task
router.post("/", authMiddleware, createTask);
// Route to get all tasks
router.get("/", authMiddleware, getTasks);
// Route to update a task
router.put("/:id", authMiddleware, updateTask);
// Route to delete a task
router.delete("/:id", authMiddleware, deleteTask);

module.exports = router;