import React, { useState, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../UserContext';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [redirect, setRedirect] = useState(false);
  const { setUserInfo } = useContext(UserContext);

  const UserLogin = async (e) => {
    e.preventDefault();
    const url = (import.meta.env.VITE_SERVER_URL || 'http://localhost:3001') + '/api/login';
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
        credentials: 'include'
      });

      if (response.ok) {
        const userInfo = await response.json();
        setUserInfo(userInfo);
        setRedirect(true);
      } else {
        alert('Login Failed, wrong credentials');
      }
    } catch (error) {
      console.error('An error occurred. Please try again, Error:', error);
    }
  };

  if (redirect) {
    return <Navigate to='/' />;
  }

  return (
    <form className='login' onSubmit={UserLogin}>
      <h2>Login</h2>
      <input 
        type="text" 
        placeholder='Username'
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input 
        type="password" 
        placeholder='Password'
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Login</button>
    </form>
  );
}
