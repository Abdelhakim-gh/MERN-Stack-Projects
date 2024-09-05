import './DashBoardPage.css'
import { Outlet } from 'react-router-dom';

function DashBoardPage() {
  return (
    <>
      <div className="dashboard-container">
        <div className="texts">
          <div className="logo">
            <img src="/logo.png" alt="logo" />
            <h1>Chat Bot</h1>
          </div>
            <div className="options">
            <div className="option">
              <img src="/chat.png" alt="" />
              <span>Create a chat</span>
            </div>
            <div className="option">
              <img src="/image.png" alt="" />
              <span>Analyse Images</span>
            </div>
            <div className="option">
              <img src="/code.png" alt="" />
              <span>Code Assistance</span>
            </div>
          </div>
        </div>
        <div className="form-container">
          <form action="">
            <input 
              type="text" 
              placeholder="Ask anything..."
            />
            <button>
              <img src="/arrow.png" alt="" />
            </button>
          </form>
          </div>
      </div>
    </>
  )
}

export default DashBoardPage