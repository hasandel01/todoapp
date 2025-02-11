import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from './axios/axios';
import './css/TaskListDetails.css';

interface Task {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  completed: boolean;
}

const TaskListDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState({ title: '', description: '', dueDate: '', completed: false });
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axiosInstance.get(`/task-list/${id}`);
      console.log("API Response:", response.data); // Debugging to check structure
  
      if (response.data && Array.isArray(response.data.tasks)) {
        setTasks(response.data.tasks); // Extract tasks properly
      } else {
        setTasks([]); // Ensure tasks is always an array
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setTasks([]); // Set as empty array in case of failure
    }
  };
  
  const handleAddTask = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await axiosInstance.post(`/task-list/${id}/task`, newTask);
      setTasks([...tasks, response.data]);
      setMessage('Task added successfully!');
      setNewTask({ title: '', description: '', dueDate: '', completed: false });
    } catch (error) {
      setMessage('Failed to add task.');
      console.error('Error adding task:', error);
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    try {
      await axiosInstance.delete(`/task-list/${id}/task/${taskId}`);
      setTasks(tasks.filter(task => task.id !== taskId));
      setMessage('Task deleted successfully!');
    } catch (error) {
      setMessage('Failed to delete task.');
      console.error('Error deleting task:', error);
    }
  };

  return (
    <div className="task-list-details">
      <h2>Task List Details</h2>
      {message && <p className={message.includes('successfully') ? 'success' : 'error'}>{message}</p>}
      <ul>
        {tasks.map(task => (
          <li key={task.id}>
            <span>{task.title} - {task.description} (Due: {task.dueDate})</span>
            <button onClick={() => handleDeleteTask(task.id)}>Delete</button>
          </li>
        ))}
      </ul>
      <h3>Add Task</h3>
      <form onSubmit={handleAddTask}>
        <input type="text" placeholder="Title" value={newTask.title} onChange={(e) => setNewTask({ ...newTask, title: e.target.value })} required />
        <input type="text" placeholder="Description" value={newTask.description} onChange={(e) => setNewTask({ ...newTask, description: e.target.value })} required />
        <input type="date" value={newTask.dueDate} onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })} required />
        <label>
          Completed:
          <input type="checkbox" checked={newTask.completed} onChange={(e) => setNewTask({ ...newTask, completed: e.target.checked })} />
        </label>
        <button type="submit">Add Task</button>
      </form>
    </div>
  );
};

export default TaskListDetails;