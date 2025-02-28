import { useEffect, useState } from 'react';
import axiosInstance from './axios/axios';
import { useNavigate} from 'react-router-dom';
import TaskListDetails from './components/TaskListDetails';
import AddTaskList from './components/AddTaskList';
import './css/Dashboard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faSignOutAlt, faUser } from '@fortawesome/free-solid-svg-icons';
import UserProfile from './components/UserProfile';

const Dashboard = () => {

  const [taskLists, setTaskLists] = useState<{ id: number; title: string }[]>([]);
  const [user, setUser] = useState<{ username: string, email: string, profileUrl: string} | null>(null);
  const [error, setError] = useState('');
  const [selectedTaskListId, setSelectedTaskListId] = useState<number | null>(null);
  const [addTaskListSuccess, setAddTaskListSuccess] = useState(false);
  const [deleteTaskListSuccess, setDeleteTaskListSuccess] = useState(false);
  const [title, setTitle] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const navigate = useNavigate();
  const [profileToggle, setProfileToggle] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [userProfile, setUserProfile] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
    const documentElement = document.documentElement;
    documentElement.classList.toggle('dark-mode');
  }

  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedDarkMode);
  }, []);
  
  useEffect(() => {
    localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode]);
  

  const handleLogout = async () => {
    try {
      localStorage.removeItem('token');
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const createDefaultTaskList = async () => {
    try {

      const defaultTaskList = await axiosInstance.post(`/task-list/add`, {
        title: 'My Tasks' 
      });
      setTaskLists(prevTaskLists => [...prevTaskLists, defaultTaskList.data]);
      setSelectedTaskListId(defaultTaskList.data.id);
      handleAddTaskListSuccess();

    }
    catch (error) {
      console.error('Error creating default task list:', error);
    }
  };

  useEffect(() => {

    const fetchData = async () => {
      
      try {
        const userResponse = await axiosInstance.get('/auth/me');
        setUser(userResponse.data);
        setImageUrl(userResponse.data.profilePictureUrl);
      
        const taskListResponse = await axiosInstance.get('/task-list');
        setTaskLists(taskListResponse.data);

        if(taskListResponse.data.length === 0) {
          createDefaultTaskList();
        }

      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to fetch data.');
      }
    };
 
    fetchData();
  }, [addTaskListSuccess,deleteTaskListSuccess,imageUrl]);

  
  if (error) return <p>{error}</p>;
  if (!user) return <p>Loading user details...</p>;


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

  const triggerProfileToggle = () => {
    setProfileToggle(prev => !prev);
  };
  
  const toggleUserProfile = () => {
    setUserProfile(prev => !prev);
  }

  return (
    <div className={`dashboard ${darkMode ? 'dark-mode' : ''}`}>
      <header className="dashboard-header">
          <div className="picture-container">
              <img onClick={triggerProfileToggle} className="profile-picture" src={imageUrl || ''} alt='profile' />
          </div>
        </header>
          {profileToggle && (
            <div className='profile-menu'>
              <ul>
                <li className="profile-menu-icon" onClick={toggleUserProfile}>
                  <FontAwesomeIcon icon={faUser} size="lg"  /> Profile
                </li>
                <li className="profile-menu-icon" onClick={handleLogout}>
                  <FontAwesomeIcon icon={faSignOutAlt} size="lg" /> Log out
                </li> 
                <li className='toggle-container'>
                  <label className='toggle-switch'>
                    <input type='checkbox'
                    checked={darkMode}
                    onChange={toggleDarkMode} />
                    <span className='slider'></span>
                  </label>
                  <span className='toggle-label'>Dark Mode</span>
                </li>
              </ul>
            </div>
          )}
    <div className='task-lists'> 
        <div className='task-lists-sidebar'>
          <ul>
            {taskLists.map((taskList) => (
              <li key={taskList.id} onClick={ () => handleSelection(taskList.id, taskList.title)}
              className= { selectedTaskListId === taskList.id ? 'selected' : ''}>{taskList.title} 
              </li>
            ))}
          </ul>
          <div className='create-new-list-container'>
            <AddTaskList onAddTaskListSuccess={handleAddTaskListSuccess} />
        </div>
        </div>
        <div className='task-lists-main'>
          {selectedTaskListId && <TaskListDetails
                                          onUpdateTaskList={handleUpdateTaskListTitle}
                                          onHandleDeleteTaskList={refreshTaskLists}
                                          id={selectedTaskListId}/>}
          </div> 
      </div>
      {userProfile && (
        <div className="user-profile-container">
          <UserProfile />
          <button className="close-profile" onClick={() => setProfileToggle(false)}>X</button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
