import { useState } from "react"
import { Navigate } from "react-router-dom";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // clear the fields when button is clicked
  const onClear = () => {
    setUsername("")
    setEmail("")
    setPassword("")
  }

  // trigger request to the backend to create user
  const RegisterUser = async (e) => {
    e.preventDefault();
    const url = (import.meta.env.VITE_SERVER_URL || 'http://localhost:3001') + '/api/register';
    console.log(url);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Register Success: ', result);
        onClear();
        
        window.location.href = '/login';
      } else {
        alert('Register Failed');
      }
    } catch (error) {
      console.error('An error occurred. Please try again, Error:', error);
    }
  };

  return (
    <>
      <form  className="register" onSubmit={RegisterUser}>
        <h2>Register</h2>
        <input 
          type="email" 
          placeholder='Email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
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
        <button type="submit">Register</button>
        <button type="reset" onClick={onClear}>Clear</button>
      </form>
    </>
  )
}

export default Register