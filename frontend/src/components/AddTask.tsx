import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { addTask } from '../axios/axios';  // Import addTask function
import '../css/AddTask.css'; 

const AddTask = () => {
  const [message, setMessage] = useState('');
  const [taskListId, setTaskListId] = useState(1);  // Assume a fixed task list ID for now

  // Formik form setup
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
        // Call addTask from axiosInstance and pass task and taskListId
        const response = await addTask(values, taskListId);
        setMessage('Task added successfully!');
      } catch (error) {
        setMessage('Failed to add task. Please try again.');
      }
    },
  });

  return (
    <div className="add-task-container">
      <h2>Add a Task</h2>

      {/* Formik form */}
      <form onSubmit={formik.handleSubmit}>
        <div>
          <label htmlFor="title">Title</label>
          <input
            id="title"
            name="title"
            type="text"
            onChange={formik.handleChange}
            value={formik.values.title}
          />
          {formik.touched.title && formik.errors.title ? (
            <div>{formik.errors.title}</div>
          ) : null}
        </div>

        <div>
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            onChange={formik.handleChange}
            value={formik.values.description}
          />
          {formik.touched.description && formik.errors.description ? (
            <div>{formik.errors.description}</div>
          ) : null}
        </div>

        <div>
          <label htmlFor="dueDate">Due Date</label>
          <input
            id="dueDate"
            name="dueDate"
            type="date"
            onChange={formik.handleChange}
            value={formik.values.dueDate}
          />
          {formik.touched.dueDate && formik.errors.dueDate ? (
            <div>{formik.errors.dueDate}</div>
          ) : null}
        </div>

        <div>
          <label htmlFor="completed">Completed</label>
          <input
            id="completed"
            name="completed"
            type="checkbox"
            onChange={formik.handleChange}
            checked={formik.values.completed}
          />
        </div>

        <button type="submit">Add Task</button>
      </form>

      {message && (
        <div className={message.includes('successfully') ? 'success' : 'failure'}>
          {message}
        </div>
      )}
    </div>
  );
};

export default AddTask;
