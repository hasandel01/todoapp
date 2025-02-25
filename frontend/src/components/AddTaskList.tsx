import { useState } from "react"
import axiosInstance from "../axios/axios"
import '../css/AddTaskList.css'


interface AddTaskListProps {
    onAddTaskListSuccess : () => void;
}

const AddTaskList: React.FC<AddTaskListProps> = ( {onAddTaskListSuccess}) => {

    const [taskList, setTaskList] = useState<{ id: number; title: string }[]>([]);
    const [error, setError] = useState('');
    const [title, setTitle] = useState('');
    const [showTitle, setShowTitle] = useState(false);


    const handleAddTaskList = async () => {
        if (!title.trim()) return; 
    
        try {

            const response = await axiosInstance.post(`/task-list/add`, { title });
            
            console.log('Task list added:', response.data);
            setTaskList(prevList => [...prevList, response.data]);
            onAddTaskListSuccess();
            setTitle('');
        } catch (err) {
            console.error('Failed to add task list:', err);
            setError("Failed to add task list.");
        }
    };

 
    const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddTaskList();
            setShowTitle(false);
        }
        else if(e.key === 'Escape') {
            setShowTitle(false);
            setTitle('');
        }
    }

    return (
        <div className="add-task-list">
            <button type="button" className="add-task-list-button" onClick={() => setShowTitle(true)}>Create a new list</button>
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