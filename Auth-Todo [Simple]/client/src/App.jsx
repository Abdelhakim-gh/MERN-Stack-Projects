import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Register from './components/Register';
import UserContext from './UserContext';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { response } from 'express';

function App() {
  const [email, setEmail] = useState('');

  // logging using cookie / json web token
  useEffect(() => {
    axios.get((import.meta.env.VITE_API_URL || 'http://localhost:3000/user'), {withCredentials: true})
    .then(response => {
      setEmail(response.data.email);
    })
  }, [])

  return (
    <>
      <UserContext.Provider value={{email: setEmail}}>
        <BrowserRouter>
          <div>
            {!!email && (
              <div>Logged in as {email}</div>
            )}
            {!email && (
              <div>Not logged in</div>
            )}
          </div>
          <nav>
            <Link to="/">Home</Link>  |
            <Link to="/register">Register</Link>  |
            <Link to="/login">Login</Link>
          </nav>
          <hr />
          <Routes>
            {/* Add other routes here */}
            <Route path='/register' element={<Register />} />
          </Routes>
        </BrowserRouter>
      </UserContext.Provider >
    </>
  );
}

export default App;
