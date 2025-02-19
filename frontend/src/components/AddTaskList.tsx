import { useEffect,useState } from "react"
import axiosInstance from "../axios/axios"

const AddTaskList = () => {

    const [taskList, setTaskList] = useState<{ id: number; title: string }[]>([]);
    const [error, setError] = useState('');

    useEffect(() => {

        const fetchTaskLists = async () => {

            const response = await axiosInstance.post('/');
            console.log("API Response:", response.data);
            if (response.data && Array.isArray(response.data)) {
                setTaskList(response.data);
            } else {
                setTaskList([]);

            }
        };

        fetchTaskLists();
    }, []);


    return (
        <div className="add-task-list">
            <h2>Add A New Task List</h2>
            <form>
                <label htmlFor="title">Title:</label>
                <input type="text" id="title" name="title" />
                <button type="submit">Add Task List</button>
            </form>
            </div>
            );
}

export default AddTaskList;