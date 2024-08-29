import { useState, useEffect, useContext } from 'react';
import {Navigate, useParams} from 'react-router-dom'
import Editor from '../components/Editor';

const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image'
]

export const EditPostPage = () => {

    const {id} = useParams()

    const [title, setTitle] = useState(''); 
    const [summary, setSummary] = useState('');
    const [content, setContent] = useState('');
    const [files, setFiles] = useState('')
    // const [cover, setCover] = useState('')
    const [redirect, setRedirect] = useState(false)

    const url = (import.meta.env.VITE_SERVER_URL || 'http://localhost:3001');

    useEffect(() => {
        fetch(url + '/api/blog/' + id).then(response => {
            response.json().then(postInfo => {
                setTitle(postInfo.title)
                setSummary(postInfo.summary)
                setContent(postInfo.content)
                // setCover(postInfo.cover)
            })
        })
    }, [])

    const updatePost = async (ev) => {
        ev.preventDefault()
        
        const data = new FormData()
        data.set('title', title);
        data.set('summary', summary);
        data.set('content', content);
        if (files?.[0]) {
            console.log(files[0])
            data.set('file', files?.[0])
        }
        
        const res = await fetch(url + '/api/blog/edit/' + id, {
            method: 'PUT',
            credentials: 'include',
            body: data
        })

        if(res.ok) {
            setRedirect(true)
        }
    }

    if (redirect) {
        return <Navigate to={'/blog/edit/'+id}/>
    }
    
    return (
    <>
        <form onSubmit={updatePost}>
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
            <button style={{marginTop:"16px"}} >Update Post</button>
        </form>
    </>
    )
}
