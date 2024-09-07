import './DashBoardPage.css'
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth, useUser } from '@clerk/clerk-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

function DashBoardPage() {

  const url = import.meta.env.VITE_API_URL + '/api/chats'
  // const {userId} = useAuth();

  const navigate = useNavigate()

  // Access the client
  const queryClient = useQueryClient()

  // // Queries
  // const query = useQuery({ queryKey: ['todos'], queryFn: getTodos })

  // Mutations
  const mutation = useMutation({
    mutationFn: (prompt) => {
      return fetch(url, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: prompt }),
      }).then(res => res.json())
    },
    onSuccess: (id) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['userChats'] })
      navigate(`/dashboard/chats/${id}`)
    },
  })

  const handleSubmit = async (e) => {
    e.preventDefault();
    const prompt = e.target.prompt.value;
    if (!prompt) return;

    mutation.mutate(prompt);
    // // send post request to create chat
    // await fetch(url, {
    //   method: 'POST',
    //   credentials: 'include',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({ text: prompt }),
    // })
  }

  return (
    <>
      <div className="dashboard-container">
        <div className="texts">
          <div className="logo">
            <img src="/logo.png" alt="logo" />
            <h1>Chat Bot</h1>
          </div>
            <div className="options">
            <div className="option">
              <img src="/chat.png" alt="" />
              <span>Create a chat</span>
            </div>
            <div className="option">
              <img src="/image.png" alt="" />
              <span>Analyse Images</span>
            </div>
            <div className="option">
              <img src="/code.png" alt="" />
              <span>Code Assistance</span>
            </div>
          </div>
        </div>
        <div className="form-container">
          <form onSubmit={handleSubmit}>
            <input 
              type="text" 
              name="prompt" 
              placeholder="Ask anything..."
            />
            <button>
              <img src="/arrow.png" alt="" />
            </button>
          </form>
          </div>
      </div>
    </>
  )
}

export default DashBoardPage