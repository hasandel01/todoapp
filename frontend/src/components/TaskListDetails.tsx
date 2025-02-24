import React, { useEffect, useState } from 'react';
import axiosInstance from '../axios/axios';
import '../css/TaskListDetails.css';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormatDate } from '../tools/FormatDate';

interface Task {
  id: number;
  title: string;
  description: string;
  dueTime: string;
  completed: boolean;
  priority: string;
}

interface TaskListDetailsProps {
  id: number
  onHandleDeleteTaskList: () => void;
  onUpdateTaskList: (id: number, title: string) => void;
}

const TaskListDetails: React.FC<TaskListDetailsProps> = ({id, onHandleDeleteTaskList, onUpdateTaskList}) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState({ title: '', description: '', dueTime: '', completed: false, priority: '' });
  const [message, setMessage] = useState('');
  const [showAddTaskForm, setShowAddTaskForm] = useState(false);
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');
  const [editedTitle, setEditedTitle] = useState<string>('');
  const [editingTaskListId, setEditingTaskListId] = useState<number | null>(null);

  useEffect(() => {
    fetchTasks();
  }, [id, editingTaskListId]);

  const fetchTasks = async () => {
    try {
      const response = await axiosInstance.get(`/task-list/${id}`);
      console.log("API Response:", response.data); 
  
      if (response.data && Array.isArray(response.data.tasks)) {
        setTitle(response.data.title);
        setTasks(response.data.tasks); 
      } else {
        setTasks([]);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setTasks([]);
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


  const handleDeleteTaskList = async () => {
    
    if (!title.trim()) return; 

    try {
      const response = await axiosInstance.delete('/task-list/delete', {
        data: { title }
      });
      onHandleDeleteTaskList();
      console.log('Task list deleted:', response.data);
    }
    catch(error) {
      console.error('Failed to delete task list:', error);
      setError("Failed to delete task list.");
    }
  
  };

  
  const handleEditedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedTitle(e.target.value);
  };

  const handleEditStart = (id: number, title: string) => {
    setEditingTaskListId(id);
    setEditedTitle(title);
  };
  
const handleEditSubmit = async () => {

  if (editingTaskListId === null) return;

  try {
      const response = await axiosInstance.put(`/task-list/edit/${editingTaskListId}`, {
        title: editedTitle
      });
      onUpdateTaskList(editingTaskListId, editedTitle);
      setEditingTaskListId(null);
      console.log('Task list edited:', response.data);
    }
    catch(error) {
      console.error('Failed to edit task list:', error);
      setError("Failed to edit task list.");
    }

};


return (
  <div className="task-list-details">
    <div className="task-list-header">
    {editingTaskListId === id ? (
                  <input 
                    type="text" 
                    value={editedTitle} 
                    onChange={handleEditedChange} 
                    onBlur={handleEditSubmit}
                    onKeyDown={(e) => e.key === 'Enter' && handleEditSubmit()}
                    autoFocus
                  />
                ) : (
                  <span onClick={() => handleEditStart(id, title)}>
                    {title}
                  </span>
                )}
      {<FontAwesomeIcon className="logout-icon" icon={faTrash} onClick={() => handleDeleteTaskList()}></FontAwesomeIcon>}
      </div>
    {message && <p className={message.includes('successfully') ? 'success' : 'error'}>{message}</p>}
    <ul>
      {tasks.map(task => (
        <li key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
          <div className='task-content'>
            <span className="task-title">{task.title}</span>
            <span className="task-description">{task.description}</span>
          </div>
          <span className="due">{FormatDate(task.dueTime)}</span>
          <button onClick={() => handleDeleteTask(task.id)} className="delete-button">
            <FontAwesomeIcon className= "trash-icon" icon={faTrash}/>
            </button>
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