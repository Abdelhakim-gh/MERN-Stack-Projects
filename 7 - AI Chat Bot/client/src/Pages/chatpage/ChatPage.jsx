import NewPrompt from '../../components/prompt/NewPrompt'
import './ChatPage.css'

function ChatPage() {
  
  return (
    <>
        <div className="chat-page">
          <div className="wrapper">
            <div className="chat">
              <div className="message ai">
                Test message from ai
              </div>  
              <div className="message user">
                Test message from user
                Lorem ipsum, dolor sit amet consectetur adipisicing elit. Dolores, quidem enim? Maxime voluptatibus natus necessitatibus esse quidem debitis nisi adipisci dolores ad rerum a, nulla, officiis repellat totam, obcaecati sit.
              </div>
              <div className="message ai">
                Test message from ai
              </div>  
              <div className="message user">
                Test message from user
              </div>
              <div className="message ai">
                Test message from ai
              </div>  
              <div className="message user">
                Test message from user
              </div>
              <div className="message ai">
                Test message from ai
              </div>  
              <div className="message user">
                Test message from user
              </div>
              <div className="message ai">
                Test message from ai
              </div>  
              <div className="message user">
                Test message from user
              </div>
              <div className="message ai">
                Test message from ai
              </div>  
              <div className="message user">
                Test message from user
              </div>
              <div className="message ai">
                Test message from ai
              </div>  
              <div className="message user">
                Test message from user
              </div>

              <NewPrompt />

              </div>
            </div>
          </div>
    </>
  )
}

export default ChatPage