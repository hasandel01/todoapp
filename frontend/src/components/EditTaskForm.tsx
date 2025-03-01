import { useEffect } from "react";
import { useFormik } from "formik";
import axiosInstance from "../axios/axios";
import "../css/EditTaskForm.css";

interface EditTaskFormProps {
  taskId: number;
  initialTitle: string;
  initialDescription: string;
  initialDueTime: string;
  initialPriority: string;
  initialIsRecurring: boolean;
  initialRecurrencePattern: "DAILY" | "WEEKLY" | "MONTHLY";
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
  onEditComplete,
}) => {
  const formik = useFormik({
    initialValues: {
      title: initialTitle,
      description: initialDescription,
      dueTime: initialDueTime,
      priority: initialPriority,
      isRecurring: initialIsRecurring,
      recurrencePattern: initialRecurrencePattern,
    },
    validate: (values) => {
      const errors: any = {};

      // Title validation
      if (!values.title) errors.title = "Title is required";

      // Description validation
      if (!values.description) errors.description = "Description is required";

      // Due time validation
      if (!values.dueTime) errors.dueTime = "Due time is required";

      // Priority validation
      if (!values.priority) errors.priority = "Priority is required";
      else if (!["LOW", "MEDIUM", "HIGH"].includes(values.priority)) {
        errors.priority = "Invalid priority";
      }

      // Recurrence pattern validation
      if (values.isRecurring) {
        if (!values.recurrencePattern) {
          errors.recurrencePattern = "Recurrence pattern is required";
        } else if (!["DAILY", "WEEKLY", "MONTHLY"].includes(values.recurrencePattern)) {
          errors.recurrencePattern = "Invalid recurrence pattern";
        }
      }

      return errors;
    },

    onSubmit: async (values) => {
      try {
        const response = await axiosInstance.put(`/edit/${taskId}`, {
          title: values.title,
          description: values.description,
          dueTime: values.dueTime,
          priority: values.priority,
          isRecurring: values.isRecurring,
          recurrencePattern: values.recurrencePattern,
        });
        console.log("API Response:", response.data);
        onEditComplete();
      } catch (error) {
        console.error("Error updating task:", error);
      }
    },
  });

  useEffect(() => {
    // Reset form values if initial props change
    formik.setValues({
      title: initialTitle,
      description: initialDescription,
      dueTime: initialDueTime,
      priority: initialPriority,
      isRecurring: initialIsRecurring,
      recurrencePattern: initialRecurrencePattern,
    });
  }, [
    initialTitle,
    initialDescription,
    initialDueTime,
    initialPriority,
    initialIsRecurring,
    initialRecurrencePattern,
  ]);

  return (
    <div className="edit-task-form-modal">
      {/* Overlay specific to the EditTaskForm */}
      <div className="edit-task-form-overlay" onClick={onEditComplete}></div>

      {/* Modal content */}
      <div className="edit-task-form">
        <form onSubmit={formik.handleSubmit}>
          {/* Title input */}
          <div className="form-field">
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

          {/* Description input */}
          <div className="form-field">
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

          {/* Due Time input */}
          <div className="form-field">
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

          {/* Priority radio buttons */}
          <div className="form-field">
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

          {/* Recurring Task checkbox and recurrence pattern */}
          <div className="form-field">
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
                {formik.touched.recurrencePattern &&
                  formik.errors.recurrencePattern && (
                    <div className="error">{formik.errors.recurrencePattern}</div>
                  )}
              </div>
            )}
          </div>

          {/* Save button */}
          <div className="form-field">
            <button type="submit">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTaskForm;
