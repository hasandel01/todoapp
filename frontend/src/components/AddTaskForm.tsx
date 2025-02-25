import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { addTask } from '../axios/axios';  // Import addTask function
import '../css/AddTaskForm.css'; 
import axiosInstance from '../axios/axios';


interface Task {
  id: number;
  title: string;
  description: string;
  dueTime: string;
  completed: boolean;
  priority: string;
}

interface AddTaskFormProps {
  taskListId: number;
  onHandleAddTask: (newTask: Task) => void;
  setShowAddTaskForm: (show: boolean) => void;
}

const AddTaskForm: React.FC<AddTaskFormProps> = ({taskListId, onHandleAddTask, setShowAddTaskForm}) => {
  
  const [message, setMessage] = useState('');
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    dueTime: '',
    completed: false,
    priority: '',
  });

  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      dueDate: '',
      completed: false,
    },
    validationSchema: Yup.object({
      title: Yup.string().required('Title is required'),
      description: Yup.string().required('Description is required'),
      dueDate: Yup.date().required('Due date is required'),
    }),
    onSubmit: async (values) => {
      try {
        const response = await addTask(values, taskListId);
        setMessage('Task added successfully!');
      } catch (error) {
        setMessage('Failed to add task. Please try again.');
      }
    },
  });

  const handleAddTask = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      newTask.completed = false;
      const response = await axiosInstance.post(`/task-list/${taskListId}/task`, newTask);
      onHandleAddTask(response.data)
      setMessage('Task added successfully!');
    } catch (error) {
      setMessage('Failed to add task.');
      console.error('Error adding task:', error);
    }
  };

  const handleKeyboardEvent = (e: React.KeyboardEvent) => {
    
    if(e.key === 'Enter') {
      handleAddTask(e as any);
    } else if(e.key === 'Escape') {
      setShowAddTaskForm(false);
    }
  };


  useEffect(() => {

    window.addEventListener('keydown', handleKeyboardEvent);


    return () => {
      window.removeEventListener('keydown', handleKeyboardEvent);
    };

  },[]);


  return (
    <div className="add-task-container">
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
          <div className='radio-group'>
            <label >Priority</label>
            <div>
              <label >
                <input 
                  type='radio'
                  name='priority'
                  value='LOW'
                  checked={newTask.priority === "LOW"}
                  onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
                />
                Low
              </label>
              <label >
                <input
                  type='radio'
                  name='priority'
                  value='MEDIUM'
                  checked={newTask.priority === "MEDIUM"}
                  onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
                />
                Medium
              </label>
              <label >
                <input
                  type='radio'
                  name='priority'
                  value='HIGH'
                  checked={newTask.priority === "HIGH"}
                  onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
                />
                High
              </label>
            </div>
          </div>
    </form>
    </div>
    </div>
    </div>
  );
};

export default AddTaskForm;
