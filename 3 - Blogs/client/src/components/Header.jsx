import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '../UserContext';

function Header() {
  const { userInfo, setUserInfo } = useContext(UserContext);

  const onLogout = (e) => {
    e.preventDefault();
    const url = (import.meta.env.VITE_SERVER_URL || 'http://localhost:3001') + '/api/logout';
    fetch(url, {
      credentials: 'include', // Ensure cookies are sent
      method: 'POST',
    }).then(() => {
      setUserInfo(null); // Clear user info from context
      window.location.href = '/';
    });
  };

  const username = userInfo?.username;

  return (
    <>
      <header>
        <Link to="/" className="logo">Blogs with MERN</Link>
        <nav className='link'>
          {username ? (
            <>
              <Link to="/profile">@Profile</Link>
              <Link to="/myblogs">My Blogs</Link>
              <Link to="/create">Create Post</Link>
              <a href="/" onClick={onLogout}>Logout</a>
            </>
          ) : (
            <>
              <Link to="/register">Register</Link>
              <Link to="/login">Login</Link>
            </>
          )}
        </nav>
      </header>
      <hr className='header-line' />
    </>
  );
}

export default Header;
