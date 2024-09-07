import './RootLayout.css'
import { Outlet, Link } from 'react-router-dom'
import { ClerkProvider } from '@clerk/clerk-react'
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

// Import your publishable key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}


// Create a client
const queryClient = new QueryClient()

function RootLayout() {
  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <QueryClientProvider client={queryClient}>
      <div className='rootLayout'>
          <header>
              <Link to="/" className="logo">
                  <img src="/logo.png" alt="" />
                  <span>Chat Bot</span>
              </Link>
              <div className="user">
                <SignedIn>
                  <UserButton />
                </SignedIn>
              </div>
          </header>
          <main>
              <Outlet />
          </main>
      </div>
      </QueryClientProvider>
    </ClerkProvider>
  )
}  

export default RootLayout