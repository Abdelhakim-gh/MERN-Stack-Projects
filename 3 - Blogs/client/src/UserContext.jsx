import { createContext, useState, useEffect } from "react";

export const UserContext = createContext({});

export const UserContextProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    // Fetch user info on page load
    const url = (import.meta.env.VITE_SERVER_URL || 'http://localhost:3001') + '/api/profile';
    fetch(url, {
      credentials: 'include', // Important to include cookies
      method: 'GET',
    })
    .then((response) => {
      if (response.ok) {
        response.json().then((data) => {
          setUserInfo(data);
        });
      } else {
        setUserInfo(null);
      }
    })
    .catch((err) => {
      console.error("Error fetching profile:", err);
      setUserInfo(null);
    });
  }, []);

  return (
    <UserContext.Provider value={{ userInfo, setUserInfo }}>
      {children}
    </UserContext.Provider>
  );
};
