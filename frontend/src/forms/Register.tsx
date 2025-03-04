import { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const user = {
      username,
      password,
      email,
    };

    try {
      const response = await axios.post('http://localhost:8080/auth/register', user);

      const { token } = response.data;

      console.log(token);

      if(token === "User with " + user.email + " is already registered.") {
        throw new Error('User with this email already exists.');
      }
 
      localStorage.setItem('jwtToken', token);

      setMessage('Registration successful!');

      navigate('/login');

    } catch (error) {
      console.error('Error during registration', error);
      if (error instanceof Error) {
        setMessage(error.message);
      } else {
        setMessage('An unknown error occurred.');
      }
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
