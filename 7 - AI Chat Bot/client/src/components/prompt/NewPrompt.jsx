import './NewPrompt.css'
import { useEffect, useRef, useState } from 'react'
import Upload from '../uploads/Upload'
import { IKImage } from 'imagekitio-react'
import model from './../../lib/gemini.js'
import Markdown from 'react-markdown'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

function NewPrompt({data}) {
  const endRef = useRef(null)
  const formRef = useRef(null)
  
  const [image, setImage] = useState({
    isLoading: false,
    error: "",
    db_data: {},
    ai_data: {}
  })

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  // start the chat
  const chat = model.startChat({
    history: [
      {
        role: "user",
        parts: [{ text: "Hello" }],
      },
      {
        role: "model",
        parts: [{ text: "Great to meet you. What would you like to know?" }],
      },
    ],
  });

  useEffect(() => {
    endRef.current.scrollIntoView({ behavior: 'smooth' })
  }, [question, answer, image.db_data]) // Ensure that scroll happens when question or answer changes

  const url = import.meta.env.VITE_API_URL + '/api/chats'

  const queryClient = useQueryClient()
  // Mutations
  const mutation = useMutation({
    mutationFn: () => {
      return fetch(url + '/' + data._id, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          question: question.length ? question : undefined,
          answer: answer,
          // image: image.db_data?.filePath || undefined,
        }),
      }).then(res => res.json())
    },
    onSuccess: (id) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['chat', data._id] }).then(() => {
        formRef.current.reset()
        setQuestion("")
        setAnswer("")
        setImage({
          isLoading: false,
          error: "",
          db_data: {},
          ai_data: {}
        })
      })
    },
    
    onError: (err) => {
      console.log(err)
    }, 
      // navigate(`/dashboard/chats/${id}`)
  })

  // in production we dont need  this instruction
  const hasRun = useRef(false) 
  useEffect(() => {
    if(!hasRun.current) {
      if(data?.history?.length === 1) {
        apiRequest(data.history[0].parts[0].text, true)
      } 
    }
    hasRun.current = true
  }, [data])

  // send api request to the model
  const apiRequest = async (prompt, isInitial) => {
    if(!isInitial) setQuestion(prompt);

    // console.log(prompt, image);
    try {
      const result = await chat.sendMessageStream(
        Object.entries(image.ai_data).length > 0 ? (image.ai_data, prompt) : (prompt)
      );
      // to stream result
      let text = ""
      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        console.log(chunkText);
        text += chunkText;
        setAnswer(text);
      } 
      
      mutation.mutate()

    } catch (error) {
      console.log(error);
    }

    // setImage({
    //   isLoading: false,
    //   error: "",
    //   db_data: {},
    //   ai_data: {}
    // })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const prompt = e.target.prompt.value; // Access the input value by name
    if (!prompt) return;
    await apiRequest(prompt, false); // Send the API request
    e.target.reset(); // Reset the input after submitting
  }

  return (
    <>
      {image.isLoading && <div className="">Loading...</div>}
      {image.db_data?.filePath && (
        <IKImage
          urlEndpoint={import.meta.env.VITE_IMAGE_KIT_ENDPOINT}
          path={image.db_data?.filePath}
          width="300"
          transformation={{ width: 300 }}
        />
      )}
      {question && (
        <div className="message user">
          {question}
        </div>
      )}
      {answer && (
        <div className="message ai">
          <Markdown>{answer}</Markdown>
        </div>
      )}

      <div className="end-chat" ref={endRef}></div>
      
      {/* Change div to form to handle submission */}
      <form className="new-from" onSubmit={handleSubmit} ref={formRef}>
        <Upload setImage={setImage} />
        <input type="file" id='file' multiple={false} hidden />
        <input type="text" name="prompt" placeholder='Ask anything...' />
        <button type="submit">
          <img src="/arrow.png" alt="" />
        </button>
      </form>
    </>
  )
}

export default NewPrompt;
