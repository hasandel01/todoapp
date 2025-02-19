import { use, useEffect, useState } from 'react';
import axiosInstance from './axios/axios';
import { Link, useParams} from 'react-router-dom';
import TaskListDetails from './components/TaskListDetails';
import AddTaskList from './components/AddTaskList';
import './css/Dashboard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faSignOutAlt} from '@fortawesome/free-solid-svg-icons';

const Dashboard = () => {
  const [taskLists, setTaskLists] = useState<{ id: number; title: string }[]>([]);
  const [user, setUser] = useState<{ username: string } | null>(null); // Add user state to store username
  const [error, setError] = useState('');
  const [selectedTaskListId, setSelectedTaskListId] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {

        const taskListResponse = await axiosInstance.get('/task-list');
        setTaskLists(taskListResponse.data);

        const userResponse = await axiosInstance.get('/auth/me');
        setUser(userResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to fetch data.');
      }
    };

    fetchData();
  }, []);

  if (error) return <p>{error}</p>;
  if (!user) return <p>Loading user details...</p>;

  return (
    <div className="dashboard">
      <header className="dashboard-header">
          <div className="user-info">
            <h3>Welcome, {user.username}!</h3> {/* Display the username */}
          </div>
          <div className='log-out'>
            <Link to="/logout"> 
            <FontAwesomeIcon icon={faSignOutAlt} />
            </Link>
          </div>
      </header>
    <div className='task-lists'> 
      <aside className='task-lists-sidebar'>
        <ul>
          {taskLists.map((taskList) => (
            <li key={taskList.id} onClick={ () => setSelectedTaskListId(taskList.id)}>
              {taskList.title}
              <TaskListDetails id={taskList.id}/> 
            </li>
          ))}
        </ul>
        <AddTaskList/>
      </aside>
      <main className='task-lists-main'>
        {selectedTaskListId && <TaskListDetails id={selectedTaskListId}/>}
        </main> 
      </div>
    </div>
  );
};

export default Dashboard;
