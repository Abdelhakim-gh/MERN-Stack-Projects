import './RootLayout.css'
import { Outlet, Link } from 'react-router-dom'

function RootLayout() {
  return (
    <div className='rootLayout'>
        <header>
            <Link to="/" className="logo">
                <img src="/logo.png" alt="" />
                <span>Chat Bot</span>
            </Link>
        </header>
        <main>
            <Outlet />
        </main>
    </div>
  )
}  

export default RootLayout