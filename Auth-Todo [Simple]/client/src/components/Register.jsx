import { useState, useContext } from "react"
import axios from 'axios'
import dotenv from 'dotenv'
import UserContext from "../UserContext"

const Register = () => {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const user = useContext(UserContext)

  const onClear = () => {
    setEmail('')
    setPassword('')
  }

  const registerUser = async (e) => {
    e.preventDefault(); // prevent browser from submiting form requestion without using fetch
    const data = {email, password}
    const url = (import.meta.env.VITE_API_URL || 'http://localhost:3000') + '/register';
    console.log("API URL:", import.meta.env.VITE_API_URL);
    axios.post(url, data, {withCredentials: true}).then(response => {
      user.setEmail(response.data.email)
    }).catch(error => {
      console.error("Error:", error);
    });
  }

  return (
    <>
        <h2>Register</h2>
        <form onSubmit={registerUser}>
          <input 
            type="email" 
            placeholder="Email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
          
          /><br/>
          <input 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)}
            
          /><br/>
          <button type="submit">Register</button>
          <button type="reset" onClick={onClear}>Clear</button>
        </form>
    </>
  )
}

export default Register