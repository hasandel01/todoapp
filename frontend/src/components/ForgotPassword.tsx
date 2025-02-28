import axiosInstance from '../axios/axios';
import '../css/ForgotPassword.css';
import { useEffect, useState } from 'react';

const ForgotPassword = () => {

    const [linkSent, setLinkSent] = useState(false);
    const [email, setEmail] = useState('');


    useEffect(() => {
        document.title = 'Forgot Password';
    }, []);


    const handleForgotPassword = async () => {

        try {
            const response = await axiosInstance.post('/auth/forgot-password', {
                email: email
            });

            if(response.status === 200) {
                setLinkSent(true);
                console.log('Reset link sent');
            }
            else {
                console.log('Error sending reset link');
                setLinkSent(false);
            }
        }
        catch (error) {
            console.error('Error sending reset link', error);
        }

    };

    return (
        <div className="forgot-password-form">
            <div className="form-group">
            <input
                type="text"
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