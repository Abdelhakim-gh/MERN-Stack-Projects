import { useState } from 'react';
import {Navigate} from 'react-router-dom'
import Editor from '../components/Editor';
import defaultCover from '../../public/cover.png';

const onClear = () => {
    setTitle('');
    setSummary('');
    setContent('');
}

export const CreatePostPage = () => {
    const [title, setTitle] = useState(''); 
    const [summary, setSummary] = useState('');
    const [content, setContent] = useState('');
    const [files, setFiles] = useState('')
    const [redirect, setRedirect] = useState(false)

    const createPost = async (ev) => {
        ev.preventDefault()
        
        const data = new FormData()
        data.set('title', title);
        data.set('summary', summary);
        data.set('content', content);
        // data.set('file', files[0])
        // Check if the user provided a file, else use the default cover image
        if (files && files[0]) {
            data.set('file', files[0]);
        } else {
            // Fetch the default cover image and convert it to a Blob
            const response = await fetch(defaultCover);
            const blob = await response.blob();
            data.set('file', blob, 'cover.png');
        }
        
        const url = (import.meta.env.VITE_SERVER_URL || 'http://localhost:3001') + '/api/blog';
        const res = await fetch(url, {
            method: 'POST',
            credentials: 'include',
            body: data
        })

        if(res.ok) {
            setRedirect(true)
        }
    }

    if (redirect) {
        return <Navigate to='/'/>
    }
    
    return (
    <>
        <form onSubmit={createPost}>
            <input 
                type="title" placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}    
            />
            <input 
                type="text" placeholder="Summary" 
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
            />
            <input 
                type="file" 
                onChange={(e) => setFiles(e.target.files)}
            />
            <Editor 
                value={content}
                onChange={setContent}
            />
            <button style={{marginTop:"16px"}} >Create Post</button>
            <button style={{marginTop:"4px"}} onClick={onClear}>Clear</button>
        </form>
    </>
    )
}
