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
import ProfilePage from './Pages/ProfilePage'
import MyPosts from './Pages/MyPosts'
import NotFoundPage from './Pages/NotFoundPage'

function App() {

  return (
    <>
      <UserContextProvider>
        <Routes>
          <Route path='/' element={<Layout/>} >
              {/* outlets */}
              <Route index element={<IndexPage />} errorElement={<NotFoundPage />} />
              <Route path='/login' element={<LoginPage/>} errorElement={<NotFoundPage />} />
              <Route path='/register' element={<RegisterPage />} errorElement={<NotFoundPage />} />
              <Route path='/create' element={<CreatePostPage />} errorElement={<NotFoundPage />} />
              <Route path="/blog/:id" element={<PostPage />} errorElement={<NotFoundPage />} />
              <Route path="/blog/edit/:id" element={<EditPostPage />} errorElement={<NotFoundPage />} />
              <Route path="/profile" element={<ProfilePage />} errorElement={<NotFoundPage />} />
              <Route path="/myblogs" element={<MyPosts />} errorElement={<NotFoundPage />} />
              <Route path='*' element={<NotFoundPage />} errorElement={<NotFoundPage />} />

          </Route>
        </Routes>
      </UserContextProvider>
    </>
  )
}

export default App
