import {BrowserRouter as Router, Route, Routes, Link} from 'react-router-dom'
import HomePage from './Pages/Homepage/HomePage'
import DashBoardPage from './Pages/Dashboard/DashBoardPage'
import ChatPage from './Pages/chatpage/ChatPage'
import SignInPage from './Pages/authentication/SignInPage'
import SignUpPage from './Pages/authentication/SignUpPage'
import RootLayout from './Layout/root/RootLayout'

const App = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<RootLayout/>} >
            <Route index element={<HomePage/>} />
            <Route path="/dashboard" element={<DashBoardPage />} />
            <Route path='/dashboard/chats/:id' element={<ChatPage />} />
            <Route path="/signin" element={<SignInPage />} />
            <Route path="/signup" element={<SignUpPage />} />
          </Route>
        </Routes>
      </Router>
    </>
  )
}

export default App