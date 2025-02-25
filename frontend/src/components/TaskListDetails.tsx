import React, { useEffect, useState } from 'react';
import axiosInstance from '../axios/axios';
import '../css/TaskListDetails.css';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormatDate } from '../tools/FormatDate';
import AddTaskForm from './AddTaskForm';
import EditTaskForm from './EditTaskForm';
import '../css/ToggleButton.css';
import { FaEllipsisV } from "react-icons/fa";


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
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [showCompleted, setShowCompleted] = useState(false);
  const [showMenu, setShowMenu] = useState<boolean>(false);


  useEffect(() => {
    fetchTasks();
  }, [id, editingTaskListId, newTask, editingTaskId]);

  const fetchTasks = async () => {
    try {
      const response = await axiosInstance.get(`/task-list/${id}`);  
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
  
  const handleDeleteTask = async (taskId: number) => {
    try {
      await axiosInstance.delete(`/delete/${taskId}`);
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


  const handleDeleteTaskList = async (id: number) => {
    
  
    try {
      const response = await axiosInstance.delete('/task-list/delete', {
        data: { id }
      });
      onHandleDeleteTaskList();
      console.log('Task list deleted:', response.data);
    }
    catch(error) {
      console.error('Failed to delete task list:', error);
      setError("Failed to delete task list.");
    }
  
  };

  const handleAddTask = async (newlyTask: Task) => {
    try {
      setTasks([...tasks, newlyTask]);
      setNewTask(newlyTask);
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };
  
  const handleEditedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedTitle(e.target.value);
  };

  const handleEditStart = (id: number, title: string) => {
    setEditingTaskListId(id);
    setEditedTitle(title);
  };

  const toggleShowCompleted = () => {
    setShowCompleted(prevState => !prevState);
  }
  
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


const handleEditTask = (id: number) => {
  setEditingTaskId(id);
};

  // Toggle menu visibility
  const toggleMenu = () => {
    setShowMenu((prevState) => !prevState);
  };
const filteredTasks = tasks.filter(
  (task) => showCompleted || !task.completed);

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
                  <span className="title" onClick={() => handleEditStart(id, title)}>
                    {title}
                  </span>
                )}

      <div className="toggle-container">
        <label className="toggle-switch">
          <input
            type="checkbox"
            checked={showCompleted}
            onChange={toggleShowCompleted}
          />
          <span className="slider"></span>
        </label>
        <span className="toggle-label">Show Completed</span>
      </div>
      <div>
      {<FaEllipsisV 
      onClick={toggleMenu}
      style={{
        cursor: "pointer",
        fontSize: "20px",
        marginLeft: "10px",
      }}></FaEllipsisV>}
      {showMenu && (
                <div className="dropdown-menu">
                  <ul>
                    <li className="dropdown-menu-element" onClick={() => handleDeleteTaskList(id)}>Delete List</li>
                  </ul>
                </div>
              )}
            </div>
      </div>
    {message && <p className={message.includes('successfully') ? 'success' : 'error'}>{message}</p>}
    <ul>
      {filteredTasks.map(task => (
        <li key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
            <div className='task-content' onClick={() => handleEditTask(task.id)}>
            {editingTaskId === task.id && 
                    <EditTaskForm
                      taskId={task.id}
                      initialTitle={task.title}
                      initialDescription={task.description}
                      initialDueTime={task.dueTime}
                      initialCompleted={task.completed}
                      initialPriority={task.priority}
                      onEditComplete={() => setEditingTaskId(null)} 
                    /> }
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
    {showAddTaskForm && ( <AddTaskForm setShowAddTaskForm={setShowAddTaskForm} 
                                      onHandleAddTask={handleAddTask} 
                                      taskListId={id} /> )}
    <button className='add-task-button' onClick={toggleAddTaskForm}>+</button>
  </div>
);
}

export default TaskListDetails;