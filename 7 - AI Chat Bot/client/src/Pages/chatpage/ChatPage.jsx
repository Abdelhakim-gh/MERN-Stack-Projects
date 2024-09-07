import { useParams } from 'react-router-dom';
import NewPrompt from '../../components/prompt/NewPrompt';
import './ChatPage.css';
import { useQuery } from '@tanstack/react-query';
import Markdown from 'react-markdown'; // Corrected import: 'Markdown' instead of 'Mardown'
import { IKImage } from 'imagekitio-react';

function ChatPage() {
  const { id } = useParams();

  const { isLoading, isError, data } = useQuery({
    queryKey: ['chatData', id],
    queryFn: () =>
      fetch(`${import.meta.env.VITE_API_URL}/api/chats/${id}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      }).then(res => {
        if (res.ok) {
          // console.log(res.json());
          return res.json()
        } 
      }),
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Something went wrong!</div>;

  return (
    <div className="chat-page">
      <div className="wrapper">
        <div className="chat">
          {data?.history.map((message, i) => (
              <div
                key={i} 
                className={message.role === "user" ? "message user" : "message ai"}>
                <Markdown>
                  {message.parts[0].text}
                </Markdown>
              </div>
          ))}

          {data && <NewPrompt data={data} />}

        </div>
      </div>
    </div>
  );
  
}

// {data?.history.map((message, i) => (
//   <React.Fragment key={i}>
//     {message.image && (
//       <IKImage 
//         urlEndpoint={import.meta.env.VITE_IMAGE_KIT_ENDPOINT}
//         path={message.image}
//         width="300"
//         height="300"
//         transformation={[{ height: 300, width: 300 }]}
//         loading="lazy"
//         lqip={{ active: true, quality: 20 }}
//       />
//     )}
//     <div 
//       className={message.role === "user" ? "message user" : "message ai"}>
//       <Markdown>
//         {message.parts[0].text}
//       </Markdown>
//     </div>
//   </React.Fragment>
// ))}

export default ChatPage;