import { useState } from 'react';
import './HomePage.css'
import { Link } from 'react-router-dom'
import { TypeAnimation } from 'react-type-animation';


function HomePage() {
  const [typingStatus, setTypingStatus] = useState('human1')

  // // to test if the authentication credentiels is working
  const test = async () => {
    const url = 'http://localhost:3001/api/test/auth'
    await fetch(url, {
      credentials: 'include',
      method: 'GET',
    })
  }

  return (
    <>
      <div className="home-page">
        <img className='orbital' src="/orbital.png" alt="orbital-bg"  />
        <div className="left">
          <h1>Chat Bot</h1> 
          <h2>Enhuance you productivity with AI</h2>
          <h3>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime commodi nam sequi dolorum accusantium sapiente,
          </h3>
          <Link to="/dashboard">Get Startd</Link>
          {/* <button onClick={test}>Test auth</button> */}
        </div>
        <div className="right">
          <div className="img-container">
            <div className="bg-container">
              <div className="bg"></div>
            </div>
            <img className='bot' src="/bot.png" alt="bot-p"  />
            <div className="chat">
              <img 
                src={typingStatus === "human1" ? "/human1.jpeg" : typingStatus === "human2" ? "human2.jpeg" : "/bot.png"} 
                alt="bot-p" 
              />
              <TypeAnimation
                sequence={[
                  // Same substring at the start will only be typed out once, initially
                  'User: We produce food for Mice',
                  2000, () => {
                    setTypingStatus("Bot")
                  },
                  'Bot: We produce food for Hamsters',
                  2000,() => {
                    setTypingStatus("human2")
                  },
                  'User: We produce food for Guinea Pigs',
                  2000,() => {
                    setTypingStatus("Bot")
                  },
                  'Bot: We produce food for Chinchillas',
                  2000, () => {
                    setTypingStatus("human1")
                  }
                ]}
                wrapper="span"
                repeat={Infinity}
                cursor={true}
                omitDeletionAnimation={true}
              />
            </div>
          </div> 
        </div>
        <div className="terms">
          <img src="/logo.png" alt="" />
          <div className="links">
            <Link to="/">Terms of Service</Link>
            <span></span>
            <Link to="/">Privacy Policy</Link>
          </div>
          <div className="copyright">
            <p>&copy; 2024 Chat Bot. All rights reserved</p>
          </div>
        </div>
      </div>
    </>
  )
}

export default HomePage