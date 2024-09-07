import { Link } from "react-router-dom";
import './ChatList.css';
import { useQuery } from '@tanstack/react-query';

function ChatList() {

  const { isLoading, isError, data } = useQuery({
    queryKey: ['userChats'],
    queryFn: () =>
      fetch(`${import.meta.env.VITE_API_URL}/api/chats`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      }).then((res) => res.json()),
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Something went wrong!</div>;

  return (
    <div className="chat-list">
      <hr />
      <span className="title">DashBoard</span>
      <Link to="/dashboard">Create a new chat</Link>
      <Link to="/">Explore</Link>
      <Link to="/">Contact</Link>
      <hr />
      <span className="title">Recent chats</span>
      <div className="list">
        {data && data.length > 0 ? (
          data.map((chat) => (
            <Link to={`/dashboard/chats/${chat.chat_id}`} key={chat.chat_id}>
              {chat.title}
            </Link>
          ))
        ) : (
          <div>No Chats</div>
        )}
      </div>
      <hr />
      <div className="upgrade">
        <img src="/logo.png" alt="Upgrade Logo" />
        <div className="texts">
          <span>Upgrade</span>
          <span>Get access to all features</span>
        </div>
      </div>
    </div>
  );
}

export default ChatList;