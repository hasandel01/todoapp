import { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axiosInstance from "../axios/axios";

interface EditTaskFormProps {
  taskId: number;
  initialTitle: string;
  initialDescription: string;
  initialDueTime: string;
  initialPriority: string;
  initialIsRecurring: boolean;
  initialRecurrencePattern: 'DAILY' | 'WEEKLY' | 'MONTHLY';
  onEditComplete: () => void;
}

const EditTaskForm: React.FC<EditTaskFormProps> = ({
  taskId,
  initialTitle,
  initialDescription,
  initialDueTime,
  initialPriority,
  initialIsRecurring,
  initialRecurrencePattern,
  onEditComplete
}) => {
  const formik = useFormik({
    initialValues: {
      title: initialTitle,
      description: initialDescription,
      dueTime: initialDueTime,
      priority: initialPriority,
      isRecurring: initialIsRecurring,
      recurrencePattern: initialRecurrencePattern
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Title is required"),
      description: Yup.string().required("Description is required"),
      dueTime: Yup.date().required("Due time is required"),
      priority: Yup.string().oneOf(["LOW", "MEDIUM", "HIGH"]).required("Priority is required"),
      isRecurring: Yup.boolean(),
      recurrencePattern: Yup.string().when("isRecurring", {
        is: true,
        then: Yup.string().oneOf(["DAILY", "WEEKLY", "MONTHLY"]).required("Recurrence pattern is required"),
        otherwise: Yup.string().notRequired()
      })
    }),
    onSubmit: async (values) => {
      try {
        const response = await axiosInstance.put(`/edit/${taskId}`, {
          title: values.title,
          description: values.description,
          dueTime: values.dueTime,
          priority: values.priority,
          isRecurring: values.isRecurring,
          recurrencePattern: values.recurrencePattern
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
      priority: initialPriority,
      isRecurring: initialIsRecurring,
      recurrencePattern: initialRecurrencePattern
    });
  }, [initialTitle, initialDescription, initialDueTime, initialPriority, initialIsRecurring, initialRecurrencePattern]);

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
            Recurring Task:
            <input
              type="checkbox"
              name="isRecurring"
              checked={formik.values.isRecurring}
              onChange={formik.handleChange}
            />
          </label>
          {formik.values.isRecurring && (
            <div>
              <div>Recurrence Pattern:</div>
              <label>
                <input
                  type="radio"
                  name="recurrencePattern"
                  value="DAILY"
                  checked={formik.values.recurrencePattern === "DAILY"}
                  onChange={formik.handleChange}
                />
                Daily
              </label>
              <label>
                <input
                  type="radio"
                  name="recurrencePattern"
                  value="WEEKLY"
                  checked={formik.values.recurrencePattern === "WEEKLY"}
                  onChange={formik.handleChange}
                />
                Weekly
              </label>
              <label>
                <input
                  type="radio"
                  name="recurrencePattern"
                  value="MONTHLY"
                  checked={formik.values.recurrencePattern === "MONTHLY"}
                  onChange={formik.handleChange}
                />
                Monthly
              </label>
              {formik.touched.recurrencePattern && formik.errors.recurrencePattern && (
                <div className="error">{formik.errors.recurrencePattern}</div>
              )}
            </div>
          )}
        </div>

        <div>
          <button type="submit">Save</button>
        </div>
      </form>
    </div>
  );
};

export default EditTaskForm;
