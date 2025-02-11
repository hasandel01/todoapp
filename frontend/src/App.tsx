import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./Home";
import TaskListDetails from "./TaskListDetails";

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/task-list/:id" element={<TaskListDetails/>} />
            </Routes>
        </Router>
    )
}

export default App;