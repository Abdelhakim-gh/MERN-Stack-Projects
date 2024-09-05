import { useAuth } from '@clerk/clerk-react'
import './DashboardLayout.css'
import { Navigate, Outlet, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import ChatList from '../../components/chats/ChatList'

// layout for user chats
function DashboardLayout() {
  
  const {userId, isLoaded} = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if(isLoaded && !userId) {
      navigate("/sign-in")
    }
  }, [isLoaded, userId, navigate])

  if (!isLoaded) return "Loading..."

  return (
    <div className='dashboard-layout'>
        <div className='menu'>
            <ChatList/>
        </div>
        <div className='content'>
            <Outlet />
        </div>
    </div>
  )
}

export default DashboardLayout