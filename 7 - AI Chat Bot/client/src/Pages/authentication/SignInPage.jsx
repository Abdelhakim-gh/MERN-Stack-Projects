import './SignInPage.css'
import { Link } from 'react-router-dom'
import { SignIn } from '@clerk/clerk-react'

function SignInPage() {
  return (
    <>
      <div className="sign-in-page">
        <SignIn path='/sign-in' signUpUrl='/sign-up' forceRedirectUrl={"/dashboard"}></SignIn>
      </div>
    </>
  )
}

export default SignInPage