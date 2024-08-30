import { Link } from 'react-router-dom';
import { useEffect, useContext } from 'react';
import { UserContext } from '../UserContext';

function Header() {
  const { userInfo, setUserInfo } = useContext(UserContext);

  useEffect(() => {
    if (userInfo?.id !== null && userInfo?.id !== undefined && userInfo?.id.trim() !== '') {
      const url = (import.meta.env.VITE_SERVER_URL || 'http://localhost:3001') + '/api/profile';
      fetch(url, {
        credentials: 'include',
        method: 'GET'
      }).then(response => {
        if (response.ok) {
          response.json().then(userInfo => {
            setUserInfo(userInfo);
          });
        }
      });
    }
  }, [userInfo.username, setUserInfo]);

  const onLogout = (e) => {
    e.preventDefault();
    const url = (import.meta.env.VITE_SERVER_URL || 'http://localhost:3001') + '/api/logout';
    fetch(url, {
      credentials: 'include',
      method: 'POST'
    }).then(() => {
      setUserInfo(null);
      window.location.href = '/';
    });
  };

  const username = userInfo?.username;

  return (
    <header>
      <Link to="/" className="logo">Blogs with MERN</Link>
      <nav className='link'>
        {username ? (
          <>
            <Link to="/profile" >@{username}</Link>
            <Link to="/create">Create Post</Link>
            <a href="/" onClick={onLogout}>Logout</a>
            <span></span>
          </>
        ) : (
          <>
            <Link to="/register">Register</Link>
            <Link to="/login">Login</Link>
          </>
        )}
      </nav>
    </header>
  );
}

export default Header;
