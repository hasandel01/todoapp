import React, { useRef, useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { addTask } from '../axios/axios';  // Import addTask function
import '../css/AddTaskForm.css'; 
import axiosInstance from '../axios/axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle, faSync } from '@fortawesome/free-solid-svg-icons';

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

interface AddTaskFormProps {
  taskListId: number;
  onHandleAddTask: (newTask: Task) => void;
}

const AddTaskForm: React.FC<AddTaskFormProps> = ({ taskListId, onHandleAddTask }) => {

  const [message, setMessage] = useState('');
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    dueTime: '',
    completed: false,
    priority: 'LOW',
    recurring: false,
    recurrencePattern: 'DAILY'
  });
  const [showAddTaskForm, setShowAddTaskForm] = useState(false);
  const [showPriorityMenu, setShowPriorityMenu] = useState(false);  // State to toggle priority menu visibility
  const dueTimePickerRef = useRef(null); // Ref for the DueTimePicker component

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

    if (!newTask.title.trim()) {
      setMessage('Title is required!');
      return;
    }

    try {
      newTask.completed = false;
      const response = await axiosInstance.post(`/task-list/${taskListId}/task`, newTask);
      onHandleAddTask(response.data);
      setMessage('Task added successfully!');
    } catch (error) {
      setMessage('Failed to add task.');
      console.error('Error adding task:', error);
    }
  };

  const isTitleEmpty = !newTask.title.trim();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {

      if (
        !(event.target as Element).closest('.add-task-container') &&
        !(event.target as Element).closest('.MuiDialog-root') // Ignore click on the date picker dialog
      ) {
        setShowAddTaskForm(false);
        setShowPriorityMenu(false);  // Close the priority menu if clicked outside
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const toggleRecurring = () => {
    setNewTask({
      ...newTask,
      recurring: !newTask.recurring,
      recurrencePattern: newTask.recurring ? '' : 'DAILY',
    });
  };

  const handlePriorityChange = (priority: string) => {
    setNewTask({
      ...newTask,
      priority,
    });
    setShowPriorityMenu(false);  // Close the menu after selecting a priority
  };

  const currentDateTime = new Date().toISOString().slice(0, 16); // This removes the seconds part to match datetime-local format

  return (
    <div className="add-task-container">
      <div className="form-title">
        <input
          type="text"
          onFocus={() => setShowAddTaskForm(true)}
          placeholder="Add a task"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          required
        />
        {showAddTaskForm && (
          <div className="form-details">
            <input
              type="text"
              placeholder="Description"
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              required
            />
            <div className="additional-details">
              <label htmlFor="dueTime"></label>
              <input
                type="datetime-local"
                id="dueTime"
                value={newTask.dueTime}
                onChange={(e) => setNewTask({ ...newTask, dueTime: e.target.value })}
                min={currentDateTime} // Set the minimum date and time to today
                required
              />
              <div className="radio-group">
                <div className="priority-button" onClick={() => setShowPriorityMenu(!showPriorityMenu)}>
                  <FontAwesomeIcon
                    icon={faExclamationCircle}
                    title="Set Priority"
                  />
                </div>
                {showPriorityMenu && (
                  <div className="priority-menu">
                    <ul>
                      <li onClick={() => handlePriorityChange('LOW')}>Low</li>
                      <li onClick={() => handlePriorityChange('MEDIUM')}>Medium</li>
                      <li onClick={() => handlePriorityChange('HIGH')}>High</li>
                    </ul>
                  </div>
                )}
              </div>
              <div className="repeat-task-container">
                <FontAwesomeIcon
                  className='repeat-task-icon'
                  icon={faSync}
                  title="Set a Repeated Task"
                  onClick={toggleRecurring}
                />
                {newTask.recurring && (
                  <div className="recurring-options">
                    <ul>
                      <li onClick={() => setNewTask({ ...newTask, recurrencePattern: 'DAILY' })}>Daily</li>
                      <li onClick={() => setNewTask({ ...newTask, recurrencePattern: 'WEEKLY' })}>Weekly</li>
                      <li onClick={() => setNewTask({ ...newTask, recurrencePattern: 'MONTHLY' })}>Monthly</li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
            <div className="message">{message}</div>
            <button
              type="submit"
              className={isTitleEmpty ? 'disabled-btn' : ''}
              disabled={isTitleEmpty}
              onClick={handleAddTask}
            >
              Add
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddTaskForm;
