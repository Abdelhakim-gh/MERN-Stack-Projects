import { Link } from "react-router-dom"
import './ChatList.css'

function ChatList() {
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
            <Link to="/chats/147">Chat 1</Link>
            <Link to="/chats/147">Chat 1</Link>
            <Link to="/chats/147">Chat 1</Link>
            <Link to="/chats/147">Chat 1</Link>
            <Link to="/chats/147">Chat 1</Link>
        </div>
        <hr />
        <div className="upgrade">
          <img src="/logo.png" alt="" />
          <div className="texts">
              <span>Upgrade</span>
              <span>Get access to all features</span>
          </div>
        </div>
    </div>
  )
}

export default ChatList