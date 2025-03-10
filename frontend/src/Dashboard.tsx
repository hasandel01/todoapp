import { useEffect, useState, useRef } from 'react';
import axiosInstance from './axios/axios';
import { useNavigate } from 'react-router-dom';
import TaskListDetails from './components/TaskListDetails';
import AddTaskList from './components/AddTaskList';
import './css/Dashboard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faUser, faBars } from '@fortawesome/free-solid-svg-icons';
import UserProfile from './components/UserProfile';

const Dashboard = () => {

  const [taskLists, setTaskLists] = useState<{ id: number; title: string }[]>([]);
  const [user, setUser] = useState<{ username: string, email: string, profileUrl: string } | null>(null);
  const [error, setError] = useState('');
  const [selectedTaskListId, setSelectedTaskListId] = useState<number | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const navigate = useNavigate();
  const [profileToggle, setProfileToggle] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [userProfile, setUserProfile] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);

  const defaultTaskListCreated = useRef(false);

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
    document.documentElement.classList.toggle('dark-mode');
  };

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

  const handleAddTaskListSuccess = () => {
  };

  const createDefaultTaskList = async () => {
    try {
      const defaultTaskList = await axiosInstance.post(`/task-list/add`, {
        title: 'My Tasks'
      });
      setTaskLists(prevTaskLists => [...prevTaskLists, defaultTaskList.data]);
      setSelectedTaskListId(defaultTaskList.data.id);
      handleAddTaskListSuccess();
    } catch (error) {
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
  
        if (taskListResponse.data.length === 0 && !defaultTaskListCreated.current) {
          defaultTaskListCreated.current = true;
          await createDefaultTaskList();
        } else {
          setTaskLists(taskListResponse.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to fetch data.');
      }
    };
  
    fetchData();
  }, []);


  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userResponse = await axiosInstance.get('/auth/me');
        setUser(userResponse.data);
        setImageUrl(userResponse.data.profilePictureUrl);
      } catch (error) {
        console.error('Error fetching user:', error);
        setError('Failed to fetch user data.');
      }
    };

    fetchUser();
  }, [imageUrl]);
  

  if (error) return <p>{error}</p>;
  if (!user) return <p>Loading user details...</p>;

  const refreshTaskLists = () => {
    setSelectedTaskListId(null);
  };

  const handleSelection = (id: number) => {
    setSelectedTaskListId(id);
  };

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
  };

  return (
    <div className={`dashboard ${darkMode ? 'dark-mode' : ''}`}>
      <header className="dashboard-header">
        <button className="show-sidebar" onClick={() => setShowSidebar(prev => !prev)} >
          <FontAwesomeIcon icon={faBars} size="lg" />
        </button>
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
        {showSidebar && (
          <div className={`task-lists-sidebar ${showSidebar ? '' : 'hidden'}`}>
            <ul>
              {taskLists.map((taskList) => (
                <li key={taskList.id} onClick={() => handleSelection(taskList.id)}
                  className={selectedTaskListId === taskList.id ? 'selected' : ''}>
                  {taskList.title}
                </li>
              ))}
            </ul>
            <div className='create-new-list-container'>
              <AddTaskList onAddTaskListSuccess={handleAddTaskListSuccess} />
            </div>
          </div>
        )}
        <div className={`task-list-main ${showSidebar ? '' : 'full-screen'}`}>
          {selectedTaskListId && <TaskListDetails
            onUpdateTaskList={handleUpdateTaskListTitle}
            onHandleDeleteTaskList={refreshTaskLists}
            id={selectedTaskListId} />}
        </div>
      </div>
      {userProfile && (
        <div className="user-profile-container">
          <UserProfile />
        </div>
      )}
    </div>
  );
};

export default Dashboard;
