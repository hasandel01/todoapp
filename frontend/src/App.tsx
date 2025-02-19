import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dashboard from "./Dashboard";
import Login from "./forms/Login";
import Register from "./forms/Register";
import UserProfile from "./components/UserProfile";

const App = () => {

    return (
        <Router>
            <Routes>

                {/* Public routes */}
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />

                {/* Default routes */}
                <Route path="/" element={<Dashboard />} />

                {/* Protected routes */}
                <Route path="/profile" element={<UserProfile />} />
            </Routes>
        </Router>
    );
}


export default App;