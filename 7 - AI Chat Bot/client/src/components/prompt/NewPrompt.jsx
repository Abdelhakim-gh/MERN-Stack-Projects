import './NewPrompt.css';
import { useEffect, useRef, useState } from 'react';
import Upload from '../uploads/Upload';
import { IKImage } from 'imagekitio-react';
import model from './../../lib/gemini.js';
import Markdown from 'react-markdown';
import { useMutation, useQueryClient } from '@tanstack/react-query';

function NewPrompt({ data }) {
  const endRef = useRef(null);
  const formRef = useRef(null);
  const queryClient = useQueryClient();

  const [image, setImage] = useState({
    isLoading: false,
    error: '',
    db_data: {},
    ai_data: {},
  });

  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  // Start the chat with initial history
  const chat = model.startChat({
    history: [
      {
        role: 'user',
        parts: [{ text: 'Hello' }],
      },
      {
        role: 'model',
        parts: [{ text: 'Great to meet you. What would you like to know?' }],
      },
    ],
  });

  // Scroll to the bottom when new content is added
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [question, answer, image.db_data]);

  const url = import.meta.env.VITE_API_URL + '/api/chats';

  // Mutation to update the chat
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
        }),
      }).then(res => res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['chat', data._id]).then(() => {
        formRef.current.reset();
        setQuestion('');
        setAnswer('');
        setImage({
          isLoading: false,
          error: '',
          db_data: {},
          ai_data: {},
        });
      });
    },
    onError: (err) => {
      console.error('Error updating chat:', err);
    },
  });

  // Prevent `useEffect` from running multiple times
  const hasRun = useRef(false);
  useEffect(() => {
    if (!hasRun.current && data?.history?.length === 1) {
      apiRequest(data.history[0].parts[0].text, true);
    }
    hasRun.current = true;
  }, [data]);

  // Send API request to the model
  const apiRequest = async (prompt, isInitial) => {
    if (!isInitial) setQuestion(prompt);

    try {
      const result = await chat.sendMessageStream(
        Object.entries(image.ai_data).length > 0 ? (image.ai_data, prompt) : prompt
      );

      let text = '';
      for await (const chunk of result.stream) {
        const chunkText = await chunk.text();
        text += chunkText;
        setAnswer(text); // Update answer incrementally
      }

      mutation.mutate(); // Trigger the mutation after receiving the full response
    } catch (error) {
      console.error('Error during API request:', error);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const prompt = e.target.prompt.value;
    if (!prompt) return;
    await apiRequest(prompt, false);
    e.target.reset(); // Reset the input after submitting
  };

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
      {question && <div className="message user">{question}</div>}
      {answer && (
        <div className="message ai">
          <Markdown>{answer}</Markdown>
        </div>
      )}

      <div className="end-chat" ref={endRef}></div>

      <form className="new-from" onSubmit={handleSubmit} ref={formRef}>
        <Upload setImage={setImage} />
        <input type="file" id="file" multiple={false} hidden />
        <input type="text" name="prompt" placeholder="Ask anything..." />
        <button type="submit">
          <img src="/arrow.png" alt="" />
        </button>
      </form>
    </>
  );
}

export default NewPrompt;
