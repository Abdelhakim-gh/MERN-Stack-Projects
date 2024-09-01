import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";

function Auth() {
    
  return (
    <>
        <div className="sign-in-container">
        <SignedOut >
          <Navigate to='/auth' />
          <SignUpButton mode="modal"/>
          <SignInButton mode="modal"/>
        </SignedOut>

        <SignedIn>
          <Navigate to="/" />
        </SignedIn>
        </div>
    </>
  )
}

export default Auth