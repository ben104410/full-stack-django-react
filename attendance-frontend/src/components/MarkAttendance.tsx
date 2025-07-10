import axios from '../api/axios'; // use your custom axios instance
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axiosInstance from '../api/axios';
function LoginForm() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await axiosInstance.post('users/login/', {
        username,
        password,
      });

      localStorage.setItem('user', JSON.stringify(response.data));
      navigate('/dashboard');
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || '❌ Login failed');
       
      } else {
        setError('❌ An unexpected error occurred');
      }
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button type="submit">Login</button>
      {error && <p>{error}</p>}
    </form>
  );
}

export default LoginForm;








// This component allows users to mark their attendance as either "Present" or "Absent".