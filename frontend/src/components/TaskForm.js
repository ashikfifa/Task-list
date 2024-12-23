

import React, { useState, useEffect } from 'react';
import { createTask } from '../services/taskService';
import { useNavigate } from 'react-router-dom'; 



const TaskForm = ({ task, onSave, user,token }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('');
  const [labels, setLabels] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(''); // Success state
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

console.log('4545464', token);

   // Log user when it changes
   useEffect(() => {
    console.log('Received user in TaskForm:', user);
  }, [user]);

 

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    console.log("Token in TaskForm:", token);
  }, []);

  // UseEffect to populate form when task changes
  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setStatus(task.status);
      setDueDate(task.dueDate ? task.dueDate.slice(0, 10) : '');
      setPriority(task.priority);
      setLabels(task.labels ? task.labels.join(', ') : '');
    } else {
      resetForm();
    }
  }, [task]);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setStatus('pending');
    setDueDate('');
    setPriority('medium');
    setLabels('');
    setSuccess(''); // Clear success message
    setError(''); // Clear error message
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const taskData = {
      title,
      description,
      status,
      dueDate: dueDate || undefined,
      priority,
      labels: labels.split(',').map((label) => label.trim()),
    };

    setLoading(true);

    try {
      const response = await createTask(taskData);
      console.log('Backend Response', response);
      onSave(); // Notify parent of the update
      resetForm();
      setLoading(false);
      setSuccess('Task created successfully!'); // Set success message
      setTimeout(() => setSuccess(''), 3000); // Clear after 3 seconds
      navigate('/tasks'); // Navigate to task list
      
    } catch (error) {
      setLoading(false);
      setError(error.response?.data?.message || 'Failed to save task.');
      console.error('Error details:', error);
    }
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className='bg-slate-100 shadow-xl rounded-lg p-6 max-w-lg mx-auto'
    >
      {user && user.name ? (
        <div className="mb-4 flex justify-between items-center">
          <span className="font-bold text-gray-700">Hello, {user.email}</span>
        </div>
      ) : (
        <div className="mb-4 flex justify-between items-center">
          <span className="font-bold text-gray-700">Hello</span>
        </div>
      )}

      <h2 className="text-xl font-bold mb-4">
        {task ? 'Edit Task' : 'Create New Task'}
      </h2>

      
      {success && <p className="text-green-500 mb-4">{success}</p>}
      {error && <p className="text-red-500 mb-4">{error}</p>}

      
      <div className='mb-4'>
        <label className='block text-gray-700 font-medium mb-2'>Title</label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required 
          placeholder='Enter Task Title'
          className='w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-200'
        />
      </div>
      <div className='mb-4'>
        <label className='block text-gray-700 font-medium mb-2'>Description</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} required 
          placeholder='Enter Description'
          className='w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-200'
        />
      </div>
      <div className='mb-4'>
        <label className='block text-gray-700 font-medium mb-2'>Status</label>
        <select value={status} onChange={(e) => setStatus(e.target.value)}
          className='w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-200'
        >
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>
      <div className='mb-4'>
        <label className='block text-gray-700 font-medium mb-2'>Due Date</label>
        <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} 
          className='w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-200'
        />
      </div>
      <div className='mb-4'>
        <label className='block text-gray-700 font-medium mb-2'>Priority</label>
        <select value={priority} onChange={(e) => setPriority(e.target.value)}
          className='w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-200'
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>
      <div className='mb-6'>
        <label className='block text-gray-700 font-medium mb-2'>Labels (comma separated)</label>
        <input type="text" value={labels} onChange={(e) => setLabels(e.target.value)} 
          placeholder='Enter labels separated by commas'
          className='w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-200'
        />
      </div>

      
      <div className='flex items-center justify-between'>
        <button type="submit"
          className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring focus:ring-blue-300'
        >
          {loading ? 'Creating Task...' : task ? 'Update Task' : 'Create Task'}
        </button>
        {task && (
          <button
            type="button"
            onClick={resetForm}
            className="text-red-500 hover:text-red-700 font-medium focus:outline-none"
          >
            Cancel Edit
          </button>
        )}
      </div>
    </form>
  );
};

export default TaskForm;

