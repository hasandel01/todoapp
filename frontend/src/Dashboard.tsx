import { use, useEffect, useState } from 'react';
import axiosInstance from './axios/axios';
import { Link, useNavigate, useParams} from 'react-router-dom';
import TaskListDetails from './components/TaskListDetails';
import AddTaskList from './components/AddTaskList';
import './css/Dashboard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faSignOutAlt, faTrash} from '@fortawesome/free-solid-svg-icons';

const Dashboard = () => {

  const [taskLists, setTaskLists] = useState<{ id: number; title: string }[]>([]);
  const [user, setUser] = useState<{ username: string, email: string} | null>(null);
  const [error, setError] = useState('');
  const [selectedTaskListId, setSelectedTaskListId] = useState<number | null>(null);
  const [addTaskListSuccess, setAddTaskListSuccess] = useState(false);
  const [deleteTaskListSuccess, setDeleteTaskListSuccess] = useState(false);
  const [title, setTitle] = useState('');
  const navigate = useNavigate();


  useEffect(() => {

    const fetchData = async () => {
      try {

        const userResponse = await axiosInstance.get('/auth/me');
        setUser(userResponse.data);

        const taskListResponse = await axiosInstance.get('/task-list');
        setTaskLists(taskListResponse.data);

        let fetchedTaskList = taskListResponse.data;

        if(fetchedTaskList.length === 0) {
          const defaultTaskList = await axiosInstance.post(`/task-list/add`, {
            title: 'My Tasks' 
          });
          setTaskLists(prevTaskLists => [...prevTaskLists, defaultTaskList.data]);
          setSelectedTaskListId(defaultTaskList.data.id);
          handleAddTaskListSuccess();
        }


      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to fetch data.');
      }
    };

    fetchData();
  }, [addTaskListSuccess,deleteTaskListSuccess]);

  if (error) return <p>{error}</p>;
  if (!user) return <p>Loading user details...</p>;


  const handleLogout = async () => {
  try {
    localStorage.removeItem('token');
    navigate('/login');
  } catch (error) {
    console.error('Logout failed:', error);
  }
};


  const refreshTaskLists = () => {
    setDeleteTaskListSuccess(prev => !prev);
    setSelectedTaskListId(null);
  }

  const handleAddTaskListSuccess = () => {
    setAddTaskListSuccess(prev => !prev);
  };


  const handleSelection = (id: number, title: string) => {
    setSelectedTaskListId(id);
    setTitle(title);
  }

  const handleUpdateTaskListTitle = (id: number, newTitle: string) => {
    setTaskLists(prevTaskLists =>
      prevTaskLists.map(taskList =>
        taskList.id === id ? { ...taskList, title: newTitle } : taskList
      )
    );
  };
  

  return (
    <div className="dashboard">
      <header className="dashboard-header">
          <div className="user-info">
            <h3>Welcome, {user.username}!</h3> 
          </div>
          <div className='log-out' onClick={handleLogout}>
            <FontAwesomeIcon icon={faSignOutAlt} />
          </div>
      </header>
    <div className='task-lists'> 
      <aside className='task-lists-sidebar'>
        <ul>
          {taskLists.map((taskList) => (
            <li key={taskList.id} onClick={ () => handleSelection(taskList.id, taskList.title)}
            className= { selectedTaskListId === taskList.id ? 'selected' : ''}>
            {taskList.title} 
            </li>
          ))}
        </ul>
        <AddTaskList onAddTaskListSuccess={handleAddTaskListSuccess}/>
      </aside>
      <main className='task-lists-main'>
        {selectedTaskListId && <TaskListDetails
                                        onUpdateTaskList={handleUpdateTaskListTitle}
                                        onHandleDeleteTaskList={refreshTaskLists}
                                        id={selectedTaskListId}/>}
        </main> 
      </div>
    </div>
  );
};

export default Dashboard;
