import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from './axios/axios';
import './css/TaskListDetails.css';

interface Task {
  id: number;
  title: string;
  description: string;
  dueTime: string;
  completed: boolean;
  priority: string;
}

const TaskListDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState({ title: '', description: '', dueTime: '', completed: false, priority: '' });
  const [message, setMessage] = useState('');
  const [showAddTaskForm, setShowAddTaskForm] = useState(false);

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
      setNewTask({ title: '', description: '', dueTime: '', completed: false , priority: '' });
    } catch (error) {
      setMessage('Failed to add task.');
      console.error('Error adding task:', error);
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    try {
      await axiosInstance.delete(`/task/${taskId}`);
      setTasks(tasks.filter(task => task.id !== taskId));
      setMessage('Task deleted successfully!');
    } catch (error) {
      setMessage('Failed to delete task.');
      console.error('Error deleting task:', error);
    }
  };

  const toggleAddTaskForm = () => {
    setShowAddTaskForm(prevState => !prevState);
  };

return (
  <div className="task-list-details">
    <h2></h2>
    {message && <p className={message.includes('successfully') ? 'success' : 'error'}>{message}</p>}
    <ul>
      {tasks.map(task => (
        <li key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
          <span className="task-title">{task.title}</span>
          <span className="task-description">{task.description}</span>
          <span className="due">(Due: {task.dueTime})</span>
          <button onClick={() => handleDeleteTask(task.id)} className="delete-button">Delete</button>
        </li>
      ))}
    </ul>
    {showAddTaskForm && (
      <div className='modal-overlay'>
        <div className='modal'>
        <form onSubmit={handleAddTask}>
          <input
            type="text"
            placeholder="Title"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Description"
            value={newTask.description}
            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            required
          />
          <input
            type="datetime-local"
            value={newTask.dueTime}
            onChange={(e) => setNewTask({ ...newTask, dueTime: e.target.value })}
            required
          />
          <label>
            Priority:
            <select
              value={newTask.priority}
              onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
            >
              <option value="">Select Priority</option>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
          </label>
          <label>
            Completed:
            <input
              type="checkbox"
              checked={newTask.completed}
              onChange={(e) => setNewTask({ ...newTask, completed: e.target.checked })}
            />
          </label>
          <button type="submit" disabled={!newTask.title || !newTask.description || !newTask.dueTime}>Add Task</button>
          <button type="button" onClick={() =>setShowAddTaskForm(false)}>Cancel</button>
    </form>
    </div>
    </div>
    )}
    <button className='add-task-button' onClick={toggleAddTaskForm}>+</button>
  </div>
);
}

export default TaskListDetails;