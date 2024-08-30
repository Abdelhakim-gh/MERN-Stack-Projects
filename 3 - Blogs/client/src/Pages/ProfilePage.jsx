import { useContext, useEffect, useState } from "react";
import { UserContext } from "../UserContext";

function ProfilePage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); // Consider not using this if not needed
  const { userInfo, setUserInfo } = useContext(UserContext);

  const url = import.meta.env.VITE_SERVER_URL || 'http://localhost:3001';

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch(`${url}/api/profile/${userInfo.id}`, {
          method: 'GET',
          credentials: 'include'
        });
        if (response.ok) {
          const user = await response.json();
          setUsername(user.data.username);
          setEmail(user.data.email);
          // Do not set password if you don't need to display or update it
        } else {
          console.error('Failed to fetch user profile:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, [userInfo.username]);

  const updateProfile = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${url}/api/profile/${userInfo.id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }), // Exclude password if not needed
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Profile updated successfully:', result.user);

        // Update the UserContext with the new user information
        setUserInfo(result.user);
        console.log("UserContext updated:", userInfo);

      } else {
        console.error('Failed to update profile:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <>
      <form className="profile" onSubmit={updateProfile}>
        <h2>Profile</h2>
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
          placeholder='New password ?'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Update profile</button>
      </form>
    </>
  );
}

export default ProfilePage;
