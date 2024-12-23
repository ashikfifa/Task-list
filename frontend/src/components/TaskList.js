
import React, { useState, useEffect } from "react";
import { getTasks, deleteTask, updateTask } from "../services/taskService";
import dayjs from "dayjs"; // For date formatting
import axios from "axios";


const TaskList = ({ refresh }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editingTask, setEditingTask] = useState(null); // To track the task being edited
  const [updatedTitle, setUpdatedTitle] = useState(""); // Track updated task title
  const [updatedDescription, setUpdatedDescription] = useState(""); // Track updated task description
  const [updatedLabels, setUpdatedLabels] = useState(""); // Track updated task labels
  const [updatedStatus, setUpdatedStatus] = useState(""); // Track updated task status
  const [updatedDueDate, setUpdatedDueDate] = useState(""); // Track updated task due date

  const taskColors = [
    "bg-red-100",
    "bg-green-100",
    "bg-blue-100",
    "bg-yellow-100",
    "bg-purple-100",
    "bg-pink-100",
  ]; // Array of color classes

  

  // Fetch tasks on component mount or when `refresh` changes
  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      setError(""); // Reset any previous errors
      //const token = localStorage.getItem("authtoken");
      try {
        const fetchedTasks = await getTasks(); // Fetch tasks using the service function
        setTasks(fetchedTasks); // Update the state with fetched tasks
      } catch (error) {
        setError("Error fetching tasks. Please try again.");
        console.error("Error fetching tasks:", error);
      } finally {
        setLoading(false); // Ensure loading is stopped after fetch
      }
    };

    fetchTasks();
  }, [refresh]); // Trigger re-fetch whenever `refresh` prop changes


/*
const fetchTasks = async () => {
  setLoading(true);
  setError(""); // Reset any previous errors
  const token = localStorage.getItem("authToken"); // Ensure correct token retrieval
  try {
    const response = await axios.get("http://localhost:5000/api/tasks", {
      headers: { Authorization: `Bearer ${token}` }, // Pass the token in headers
    });
    setTasks(response.data); // Update the state with fetched tasks
  } catch (error) {
    setError("Error fetching tasks. Please try again.");
    console.error("Error fetching tasks:", error);
  } finally {
    setLoading(false); // Ensure loading is stopped after fetch
  }
};
useEffect(() => {
  fetchTasks();
}, []); // Empty dependency array ensures this runs only once on mount
*/

  const handleDelete = async (taskId) => {
    try {
      await deleteTask(taskId); // Call delete function from taskService
      setTasks(tasks.filter((task) => task._id !== taskId)); // Update the state to remove the deleted task
    } catch (error) {
      console.error("Error deleting task:", error);
      setError("Error deleting task. Please try again.");
    }
  };

  const handleEditClick = (task) => {
    setEditingTask(task); // Set the task to be edited
    setUpdatedTitle(task.title); // Set the initial title for editing
    setUpdatedDescription(task.description || ""); // Set the initial description for editing
    setUpdatedLabels(task.labels.join(", ")); // Set the initial labels for editing
    setUpdatedStatus(task.status); // Set the initial status for editing
    setUpdatedDueDate(task.dueDate ? dayjs(task.dueDate).format("YYYY-MM-DD") : ""); // Set the initial due date for editing
  };

  const handleSave = async () => {
    try {
      const updatedTask = {
        ...editingTask,
        title: updatedTitle,
        description: updatedDescription,
        labels: updatedLabels.split(",").map((label) => label.trim()), // Convert comma-separated labels to an array
        status: updatedStatus,
        dueDate: updatedDueDate ? dayjs(updatedDueDate).toISOString() : null, // Format the due date to ISO string
      };

      // Call updateTask function from taskService
      const response = await updateTask(editingTask._id, updatedTask);

      // Update the tasks list with the updated task
      setTasks(
        tasks.map((task) =>
          task._id === editingTask._id ? { ...task, ...updatedTask } : task
        )
      );

      // Clear editing state after saving
      setEditingTask(null);
      setUpdatedTitle("");
      setUpdatedDescription("");
      setUpdatedLabels("");
      setUpdatedStatus("");
      setUpdatedDueDate("");
      console.log("Updated task:", response); // Optionally log the response
    } catch (error) {
      console.error("Error updating task:", error);
      setError("Error updating task. Please try again.");
    }
  };

  if (loading) return <p className="text-blue-500">Loading tasks...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="task-list bg-white shadow-lg rounded-lg p-6 mx-auto max-w-3xl">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Task List</h2>
      <ul className="space-y-4">
        {tasks.length > 0 ? (
          tasks.map((task, index) => (
            <li
              key={task._id}
              className={`flex flex-col rounded-md p-4 shadow-sm hover:bg-gray-200 ${
                taskColors[index % taskColors.length]
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  {editingTask && editingTask._id === task._id ? (
                    // When in edit mode, display input fields
                    <div>
                      <input
                        type="text"
                        value={updatedTitle}
                        onChange={(e) => setUpdatedTitle(e.target.value)}
                        className="text-lg font-medium text-gray-800 w-full mb-2"
                      />
                      <textarea
                        value={updatedDescription}
                        onChange={(e) => setUpdatedDescription(e.target.value)}
                        className="w-full p-2 border rounded-md mb-2"
                        rows="4"
                      />
                      <input
                        type="text"
                        value={updatedLabels}
                        onChange={(e) => setUpdatedLabels(e.target.value)}
                        className="w-full p-2 border rounded-md mb-2"
                        placeholder="Labels (comma separated)"
                      />
                      <select
                        value={updatedStatus}
                        onChange={(e) => setUpdatedStatus(e.target.value)}
                        className="w-full p-2 border rounded-md mb-2"
                      >
                        <option value="pending">Pending</option>
                        <option value="completed">Completed</option>
                      </select>
                      <input
                        type="date"
                        value={updatedDueDate}
                        onChange={(e) => setUpdatedDueDate(e.target.value)}
                        className="w-full p-2 border rounded-md mb-2"
                      />
                    </div>
                  ) : (
                    // Display task details when not in edit mode
                    <div>
                      <p className="text-lg font-medium text-gray-800">
                        {task.title}{" "}
                        <span
                          className={`inline-block text-xs ml-2 px-2 py-1 rounded-full ${
                            task.status === "completed"
                              ? "bg-green-200 text-green-800"
                              : "bg-yellow-200 text-yellow-800"
                          }`}
                        >
                          {task.status}
                        </span>
                      </p>
                      {task.dueDate && (
                        <p className="text-sm text-gray-600">
                          <span className="font-semibold">Due:</span>{" "}
                          {dayjs(task.dueDate).format("DD/MM/YYYY")}
                        </p>
                      )}
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold">Priority:</span> {task.priority}
                      </p>
                      {task.description && (
                        <p className="text-sm text-gray-600 mt-1">
                          <span className="font-semibold">Description:</span> {task.description}
                        </p>
                      )}
                      {task.labels && task.labels.length > 0 && (
                        <p className="text-sm text-gray-600 mt-1">
                          <span className="font-semibold">Labels:</span> {task.labels.join(", ")}
                        </p>
                      )}
                    </div>
                  )}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleDelete(task._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                  >
                    Delete
                  </button>
                  {editingTask && editingTask._id === task._id ? (
                    <button
                      onClick={handleSave} // Save changes
                      className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      onClick={() => handleEditClick(task)} // Trigger editing mode
                      className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                    >
                      Edit
                    </button>
                  )}
                </div>
              </div>
            </li>
          ))
        ) : (
          <p className="text-gray-500 text-center">No tasks found. Add a new task!</p>
        )}
      </ul>
    </div>
  );
};

export default TaskList;


