import { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  // Handle the form submission
  const handleRegister = async (e) => {
    e.preventDefault();

    // Create the user object
    const user = {
      username,
      password,
      email,
    };

    try {
      // Send the POST request to register the user
      const response = await axios.post('http://localhost:8080/auth/register', user);

      // Assuming the response contains the JWT token
      const { token } = response.data;

      // Store the JWT token in localStorage (or sessionStorage)
      localStorage.setItem('jwtToken', token);

      setMessage('Registration successful!');

      navigate('/login');

    } catch (error) {
      console.error('Error during registration', error);
      setMessage('Error during registration.');
    }
  };

  return (
    <div className='register-form'>
      <h2>Sign Up to ToDo!</h2>
      <form onSubmit={handleRegister}>
        <div className='form-group'>
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className='form-group'>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className='form-group'>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <Link to={"/login"}> Are you already an user? Sign In!</Link>
        <button type="submit">Create an Account</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Register;
