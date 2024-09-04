import './DashboardLayout.css'
import { Outlet } from 'react-router-dom'

function DashboardLayout() {
  return (
    <div className='dashboardLayout'>
        
        <div className='menu'>
            MENU
        </div>
        <div className='content'>
            <Outlet />
        </div>
    </div>
  )
}

export default DashboardLayout