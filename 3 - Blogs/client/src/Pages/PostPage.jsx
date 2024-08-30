import { useContext, useEffect, useState } from "react"
import {useParams, Link, Navigate} from 'react-router-dom'
import {formatFilePath} from './../components/Post'
import {format} from 'date-fns'
import { UserContext } from "../UserContext"

function PostPage() {
    const {id} = useParams()
    const [postInfo, setPostInfo] = useState(null)
    const [redirect, setRedirect] = useState(false)
    
    const {userInfo} = useContext(UserContext)
    
    useEffect(() => {
        const url = (import.meta.env.VITE_SERVER_URL || 'http://localhost:3001') + '/api/blog/' + id;
        fetch(url, {}).then(response => {
            response.json().then(postInfo => {
                console.log(postInfo)
                setPostInfo(postInfo)
            })
        })
    }, [])

    if (!postInfo) {
        return (
            <h2>No Content</h2>
        )
    }

    const deletePost = () => {
        const url = (import.meta.env.VITE_SERVER_URL || 'http://localhost:3001') + '/api/blog/delete/' + id;
        fetch(url, {
            method: 'DELETE',
            credentials: 'include'
        }).then((response) => {
            if (response.ok) {
                console.log('Post deleted successfully');
                if(response.ok) {
                    setRedirect(true)
                }
            } else {
                console.error('Failed to delete post');
            }
        })
    }

    if (redirect) {
        return <Navigate to={'/'}/>
    }

    return (
        <>
            <div className="post-page">
                <h1 className="title">{postInfo.title}</h1>
                <time datetime="">{format(new Date(postInfo.createdAt), 'MMM dd, yyyy HH:mm')}</time>
                <div className="author">by @{postInfo.author.username}</div>
                {userInfo.id === postInfo.author._id ? (
                    <div className="edit-post">
                        <Link 
                            className="edit-btn" 
                            to={`/blog/edit/${postInfo._id}`}
                        >   
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                            </svg>
                            Edit Post
                        </Link>
                        <a 
                            className="delete-btn" 
                            href="#"
                            onClick={deletePost}
                        >   
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                 <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                            </svg>
                            Delete Post
                        </a>
                    </div>
                ) : (
                    <></>
                ) }
                <div className="image">
                    <img 
                        src={'http://localhost:3001' + formatFilePath(postInfo.cover)}
                        alt="cover page" 
                    />
                </div>
                {/* to convert string to html */}
                <div className="content" dangerouslySetInnerHTML={{__html:postInfo.content}}></div>
            </div>
        </>
    )
}

export default PostPage