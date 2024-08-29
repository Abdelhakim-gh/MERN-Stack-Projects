import { useState } from 'react'
import {Routes, Route, BrowserRouter} from 'react-router-dom'
import './App.css'
import Layout from './components/Layout'
import IndexPage from './Pages/IndexPage'
import LoginPage from './Pages/LoginPage'
import RegisterPage from './Pages/Register'
import { UserContextProvider } from './UserContext'
import { CreatePostPage } from './Pages/CreatePostPage'
import PostPage from './Pages/PostPage'
import { EditPostPage } from './Pages/EditPostPage'

function App() {

  return (
    <>
      <UserContextProvider>
        <Routes>
          <Route path='/' element={<Layout/>} >
              {/* outlets */}
              <Route index element={<IndexPage />} />
              <Route path='/login' element={<LoginPage/>} />
              <Route path='/register' element={<RegisterPage />} />
              <Route path='/create' element={<CreatePostPage />} />
              <Route path="/blog/:id" element={<PostPage />} />
              <Route path="/blog/edit/:id" element={<EditPostPage />} />
          </Route>
        </Routes>
      </UserContextProvider>
    </>
  )
}

export default App
