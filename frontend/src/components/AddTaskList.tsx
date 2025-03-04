import { useState } from "react";
import axiosInstance from "../axios/axios";
import '../css/AddTaskList.css';

interface AddTaskListProps {
    onAddTaskListSuccess: () => void;
}

const AddTaskList: React.FC<AddTaskListProps> = ({ onAddTaskListSuccess }) => {
    const [title, setTitle] = useState('');
    const [showTitle, setShowTitle] = useState(false);

    const handleAddTaskList = async () => {
        if (!title.trim()) return;

        try {
            await axiosInstance.post(`/task-list/add`, { title });
            onAddTaskListSuccess();
            setTitle('');
        } catch (err) {
            console.error("Failed to add task list:", err);
        }
    };

    const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddTaskList();
            setShowTitle(false);
        } else if (e.key === 'Escape') {
            setShowTitle(false);
            setTitle('');
        }
    };

    return (
        <div className="add-task-list">
            {/* Label to trigger modal for new task list */}
            <label className="add-task-list-label" onClick={() => setShowTitle(true)}>
                Create a new list
            </label>

            {/* Modal for entering the new task list title */}
            {showTitle && (
                <div className="modal-overlay" onClick={() => setShowTitle(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <input
                            type="text"
                            autoFocus
                            placeholder="Please enter a title."
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default AddTaskList;
