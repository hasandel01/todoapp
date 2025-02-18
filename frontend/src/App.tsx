import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./Home";
import TaskListDetails from "./TaskListDetails";
import Login from "./forms/Login";
import Register from "./forms/Register";

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/login" element= {<Login />} />
                <Route path="/register" element= {<Register />} />
                <Route path="/" element={<Home />} />
                <Route path="/task-list/:id" element={<TaskListDetails/>} />
            </Routes>
        </Router>
    )
}

export default App;