import { useState } from 'react'
import './App.css'
import {BrowserRouter as Router, Route, Routes, Link} from 'react-router-dom'
import Index from './Pages/home';
import Auth from './Pages/auth/Auth';
import {FinancialRecordsProvider} from './contexts/financialContext';
import {SignedIn, UserButton, useUser} from '@clerk/clerk-react';

function App() {
  const {user} = useUser()
  return (
    <>
        <Router>
          <div className='app-container'>
            <div className="navbar" >
              <Link to="/">Home</Link>
              {user ? (
                <SignedIn>
                  <UserButton showName />
                </SignedIn> 
              ) : (
                <Link to="/auth">Login</Link>
              )}
            </div>
            <Routes>
              <Route 
                path="/" 
                element={
                  <FinancialRecordsProvider>
                     <Index />
                  </FinancialRecordsProvider>
                } 
              />
              <Route path="/auth" element={<Auth />} />
            </Routes>
          </div>
        </Router>
    </>
  )
}

export default App
