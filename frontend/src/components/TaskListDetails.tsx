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
  recurring: boolean;
  recurrencePattern: 'DAILY' | 'WEEKLY' | 'MONTHLY';
}

interface TaskListDetailsProps {
  id: number
  onHandleDeleteTaskList: () => void;
  onUpdateTaskList: (id: number, title: string) => void;
}

const TaskListDetails: React.FC<TaskListDetailsProps> = ({id, onHandleDeleteTaskList, onUpdateTaskList}) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState({ title: '', description: '', dueTime: '', completed: false, priority: '', recurring: false, recurrencePattern: 'DAILY' });
  const [title, setTitle] = useState('');
  const [editedTitle, setEditedTitle] = useState<string>('');
  const [editingTaskListId, setEditingTaskListId] = useState<number | null>(null);
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [showCompleted, setShowCompleted] = useState(false);
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const [completed, setCompleted] = useState<boolean>(false);

  useEffect(() => {
    fetchTasks();
  }, [id, editingTaskListId, newTask, editingTaskId,completed]);

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
    } catch (error) {
      console.error('Error deleting task:', error);
    }
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
    }

};


const handleEditTask = (id: number) => {
  setEditingTaskId(id);
};


const toggleMenu = () => {
    setShowMenu((prevState) => !prevState);
  };


  const handleCompleteTask = async (task: Task) => {
    try {  
      const response = await axiosInstance.put(`/complete/${task.id}`);
      setTasks(tasks.map(t => t.id === task.id ? { ...t, completed: !t.completed } : t));
      setCompleted(prev => !prev);
      console.log('Task completed:', response.data);
    }
    catch(error) {
      console.error('Failed to complete task:', error);
    }
  };
  

  const filteredTasks = tasks.filter((task) => showCompleted || !task.completed);

  const sortedByDateTasks = [...filteredTasks].sort((a,b) => {
      return new Date(a.dueTime).getTime() - new Date(b.dueTime).getTime();
  });
  
  const sortedByPriorityTasks = [...filteredTasks].sort((a, b) => {
    const priorityOrder: { [key: string]: number } = { "High": 1, "Medium": 2, "Low": 3 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  const [sortMethod, setSortMethod] = useState<'date' | 'priority'>('date');
  
  const tasksToDisplay = sortMethod === 'date' ? sortedByDateTasks : sortedByPriorityTasks;
  
  const handleSortChange = (method: 'date' | 'priority') => {
    setSortMethod(method);
  };


  return (
      <div className="task-list-details">
        <div className="task-list-header">
          {/* Header content goes here */}
          <div className="title-container">
            {editingTaskListId === id ? (
              <input 
                type="text"
                className='title-input'
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
          </div>
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
            <div>
              <FaEllipsisV 
                onClick={toggleMenu}
                style={{
                  cursor: "pointer",
                  fontSize: "20px",
                  marginLeft: "10px",
                }}
              />
              {showMenu && (
                <div className="dropdown-menu">
                  <ul>
                    <li className="dropdown-menu-element" onClick={() => handleDeleteTaskList(id)}>Delete List</li>
                    <li onClick={() => handleSortChange('date')}>Sort by Date</li>
                    <li onClick={() => handleSortChange('priority')}>Sort by Priority</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
        {/* Add task form component */}
        <div className="add-task-form">
          <AddTaskForm 
            onHandleAddTask={handleAddTask} 
            taskListId={id} 
          />
        </div>
        {/* Task container component */}
        <div className="task-container">
          <ul>
            {tasksToDisplay.map(task => (
              <li key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
                  <input
                    type="checkbox"
                    id='task-checkbox'
                    checked={task.completed}
                    onChange={() => handleCompleteTask(task)}
                    onClick={(e) => e.stopPropagation()} 
                  />
                  <label htmlFor='task-checkbox'></label>
                <div className="task-content" onClick={() => handleEditTask(task.id)}>
                  {editingTaskId === task.id && 
                    <EditTaskForm
                      taskId={task.id}
                      initialTitle={task.title}
                      initialDescription={task.description}
                      initialDueTime={task.dueTime}
                      initialPriority={task.priority}
                      initialIsRecurring={task.recurring}
                      initialRecurrencePattern={task.recurrencePattern || 'DAILY'}
                      onEditComplete={() => setEditingTaskId(null)} 
                    />
                  }
                  <div className="title-description">
                    <span className="task-title">{task.title}</span>
                    <span className="task-description">{task.description}</span>
                  </div>
                </div>
                <span className={task.dueTime === '' ? "empty-due" : "due"}>{FormatDate(task.dueTime)}</span>
                <button onClick={() => handleDeleteTask(task.id)} className="delete-button">
                  <FontAwesomeIcon className="trash-icon" icon={faTrash}/>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
  );
};  

export default TaskListDetails;