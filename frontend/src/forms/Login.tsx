import { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom'; 
import '../css/Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [usernameValid, setUsernameValid] = useState(false);

  const handleUsernameSubmit = async (e) => {
    e.preventDefault();

    try {

      const response = await axios.post('http://localhost:8080/auth/check-user', {username});

      if(response.data.username === username)
        setUsernameValid(true);
      
      
    } catch (error) {
      console.error('Error checking username', error);
      setErrorMessage('No user found with that username');
    }
  };

  return (
    <div className="login-form">
      <h2>Sign In to ToDo!</h2>
      { !usernameValid ? (
        <form onSubmit={handleUsernameSubmit}>
        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
         <Link to={"/register"}> Aren't you a user? Sign Up!</Link>
        <button type="submit">Next</button>
      </form>
    ) : ( 
      <PasswordForm username={username} /> ) }
    </div>
  );
};


const PasswordForm = ({ username }: { username: string }) => {

  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); 
  const navigate = useNavigate();

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    try {

      const response = await axios.post('http://localhost:8080/auth/authenticate', {username: username, password: password});

      const { token } = response.data;
      localStorage.setItem('token', token);

      navigate('/');      
    }
    catch (error) {
      console.error('Error checking password', error);
      setErrorMessage('Incorrect password');
    }
  };


    return (
      <form onSubmit={handlePasswordSubmit}>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Sign in </button>
      </form>
    );
};

export default Login;
