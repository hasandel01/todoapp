import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dashboard from "./Dashboard";
import Login from "./forms/Login";
import Register from "./forms/Register";
import ForgotPassword from "./components/ForgotPassword";

const App = () => {

    return (
        <Router>
            <Routes>

                {/* Public routes */}
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />

                {/* Default routes */}
                <Route path="/" element={<Dashboard />} />

            </Routes>
        </Router>
    );
}


export default App;