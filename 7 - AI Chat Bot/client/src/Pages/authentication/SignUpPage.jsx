import { SignUp } from '@clerk/clerk-react'
import './SignUpPage.css'

function SignUpPage() {
  return (
    <>
      <div className="sign-up-page">
        <SignUp path='/sign-up' signInUrl='/sign-in'></SignUp>
      </div>
    </>
  )
}

export default SignUpPage