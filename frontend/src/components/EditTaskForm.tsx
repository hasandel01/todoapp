import { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axiosInstance from "../axios/axios";

interface EditTaskFormProps {
  taskId: number;
  initialTitle: string;
  initialDescription: string;
  initialDueTime: string;
  initialCompleted: boolean;
  initialPriority: string;
  onEditComplete: () => void;
}

const EditTaskForm: React.FC<EditTaskFormProps> = ({
  taskId,
  initialTitle,
  initialDescription,
  initialDueTime,
  initialCompleted,
  initialPriority,
  onEditComplete
}) => {
  const formik = useFormik({
    initialValues: {
      title: initialTitle,
      description: initialDescription,
      dueTime: initialDueTime,
      completed: initialCompleted,
      priority: initialPriority
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Title is required"),
      description: Yup.string().required("Description is required"),
      dueTime: Yup.date().required("Due time is required"),
      priority: Yup.string().oneOf(["LOW", "MEDIUM", "HIGH"]).required("Priority is required")
    }),
    onSubmit: async (values) => {
      try {
        const response = await axiosInstance.put(`/edit/${taskId}`, {
          title: values.title,
          description: values.description,
          dueTime: values.dueTime,
          completed: values.completed,
          priority: values.priority
        });
        console.log("API Response:", response.data);
        onEditComplete(); 
      } catch (error) {
        console.error("Error updating task:", error);
      }
    }
  });

  useEffect(() => {
    // Reset form values if initial props change
    formik.setValues({
      title: initialTitle,
      description: initialDescription,
      dueTime: initialDueTime,
      completed: initialCompleted,
      priority: initialPriority
    });
  }, [initialTitle, initialDescription, initialDueTime, initialCompleted, initialPriority]);

  return (
    <div className="edit-task-form">
      <form onSubmit={formik.handleSubmit}>
        <div>
          <input
            type="text"
            name="title"
            value={formik.values.title}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Task title"
          />
          {formik.touched.title && formik.errors.title && (
            <div className="error">{formik.errors.title}</div>
          )}
        </div>

        <div>
          <input
            type="text"
            name="description"
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Task description"
          />
          {formik.touched.description && formik.errors.description && (
            <div className="error">{formik.errors.description}</div>
          )}
        </div>

        <div>
          <input
            type="datetime-local"
            name="dueTime"
            value={formik.values.dueTime}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Due Time"
          />
          {formik.touched.dueTime && formik.errors.dueTime && (
            <div className="error">{formik.errors.dueTime}</div>
          )}
        </div>

        <div>
          <div>Priority:</div>
          <label>
            <input
              type="radio"
              name="priority"
              value="LOW"
              checked={formik.values.priority === "LOW"}
              onChange={formik.handleChange}
            />
            Low
          </label>
          <label>
            <input
              type="radio"
              name="priority"
              value="MEDIUM"
              checked={formik.values.priority === "MEDIUM"}
              onChange={formik.handleChange}
            />
            Medium
          </label>
          <label>
            <input
              type="radio"
              name="priority"
              value="HIGH"
              checked={formik.values.priority === "HIGH"}
              onChange={formik.handleChange}
            />
            High
          </label>
          {formik.touched.priority && formik.errors.priority && (
            <div className="error">{formik.errors.priority}</div>
          )}
        </div>

        <div>
          <label>
            Completed:
            <input
              type="checkbox"
              name="completed"
              checked={formik.values.completed}
              onChange={formik.handleChange}
            />
          </label>
        </div>

        <div>
          <button type="submit">Save</button>
        </div>
      </form>
    </div>
  );
};

export default EditTaskForm;
