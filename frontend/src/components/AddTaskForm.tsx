import React, { useRef, useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { addTask } from '../axios/axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../css/AddTaskForm.css'; 
import axiosInstance from '../axios/axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faExclamationCircle, faSync } from '@fortawesome/free-solid-svg-icons';

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
  const [showPriorityMenu, setShowPriorityMenu] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);  
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showRecurringMenu, setShowRecurringMenu] = useState(false);
  const [priorityChange, setPriorityChange] = useState(false);

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

  const handleAddTask = async () => {
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
        !(event.target as Element).closest('.MuiDialog-root') &&
        !(event.target as Element).closest('.priority-menu') &&
        !(event.target as Element).closest('.recurring-options')
      ) {
        setShowAddTaskForm(false);
        setShowPriorityMenu(false);  
        setShowRecurringMenu(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);  // single useEffect for handling clicks outside

  const handlePriorityChange = (priority: string) => {
    setNewTask({
      ...newTask,
      priority,
    });
    setShowPriorityMenu(false);
    setPriorityChange(true);
  };

  const handleRecurringChange = (recurrencePattern: string) => {
    setNewTask({
      ...newTask,
      recurring: true,
      recurrencePattern: recurrencePattern,
    });
    setShowRecurringMenu(false);
  };

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
    setShowCalendar(false);
    if (date) {
      setNewTask({ ...newTask, dueTime: date.toISOString() });
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !isTitleEmpty) {
      handleAddTask();
      newTask.title = '';
    }
  }

  const handlePriorityClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    setShowPriorityMenu(!showPriorityMenu); 
  }

  const handleRecurringClick = (event: React.MouseEvent) => {
    event.stopPropagation(); 
    setShowRecurringMenu(!showRecurringMenu);
  };

  return (
    <div className="add-task-container">
      <div className="form-title">
        <input
          type="text"
          onFocus={() => setShowAddTaskForm(true)}
          placeholder="Add a task"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          onKeyDown={handleKeyPress}
          required
        />
        {showAddTaskForm && (
          <div className="form-details">
            <input
              type="text"
              placeholder="Description"
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              onKeyDown={handleKeyPress}
              required
            />
            <div className="additional-details">
              <div className="due-time-container">
                <button className="add-task-details-button" onClick={() => setShowCalendar(!showCalendar)}>
                <FontAwesomeIcon icon={faCalendarAlt} />
                </button>
                {showCalendar && (
                  <DatePicker
                  selected={selectedDate}
                  onChange={handleDateChange}
                  minDate={new Date()}
                  popperPlacement="bottom-start"
                />                                           
                  )}      
              </div>   
              <div className="priority-container">
                <div className="add-task-details-button" onClick={handlePriorityClick}>
                  <FontAwesomeIcon
                    icon={faExclamationCircle}
                    title="Set Priority"
                  />
                </div>
                {priorityChange && (
                  <div className="priority">
                    <div>{newTask.priority} priority</div>
                  </div>
                )}
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
                <div className="add-task-details-button" onClick={handleRecurringClick}>
                  <FontAwesomeIcon
                    icon={faSync}
                    title="Set a Repeated Task"
                  />
                </div>
                {newTask.recurring && (
                  <div className="recurring-task">
                    <div>Repeats {newTask.recurrencePattern.toLowerCase()}</div>
                  </div>
                )}
                {showRecurringMenu && (
                  <div className="recurring-options">
                    <ul>
                      <li onClick={() => handleRecurringChange('DAILY')}>Daily</li>
                      <li onClick={() => handleRecurringChange('WEEKLY')}>Weekly</li>
                      <li onClick={() => handleRecurringChange('MONTHLY')}>Monthly</li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddTaskForm;
