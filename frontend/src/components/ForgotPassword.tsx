import axiosInstance from '../axios/axios';
import '../css/ForgotPassword.css';
import { useState, useEffect } from 'react';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');

    useEffect(() => {
        document.title = 'Forgot Password';
    }, []);

    const handleForgotPassword = async () => {
        if (!email.trim()) {
            return;
        }

        try {
            const response = await axiosInstance.post('/auth/forgot-password', { email });

            if (response.status === 200) {
            } else {
            }
        } catch (error) {
            console.error('Error sending reset link:', error);
        }
    };

    return (
        <div className="forgot-password-form">
            <div className="form-group">
                <input
                    type="email" 
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                />
                <button onClick={handleForgotPassword}>Send a link</button>
            </div>
        </div>
    );
};

export default ForgotPassword;
