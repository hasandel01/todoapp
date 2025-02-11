import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from './axios/axios';

const Home = () => {
  const [taskLists, setTaskLists] = useState<{ id: number; title: string }[]>([]);

  useEffect(() => {
    const fetchTaskLists = async () => {
      try {
        const response = await axiosInstance.get('/task-list');
        setTaskLists(response.data);
      } catch (error) {
        console.error('Error fetching task lists:', error);
      }
    };

    fetchTaskLists();
  }, []);

  return (
    <div>
      <h1>Task Lists</h1>
      <ul>
        {taskLists.map((taskList) => (
          <li key={taskList.id}>
            <Link to={`/task-list/${taskList.id}`}>{taskList.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
