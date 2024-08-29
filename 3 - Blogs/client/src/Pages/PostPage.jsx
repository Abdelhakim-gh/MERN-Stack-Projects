import { useContext, useEffect, useState } from "react"
import {useParams,Link} from 'react-router-dom'
import {formatFilePath} from './../components/Post'
import {format} from 'date-fns'
import { UserContext } from "../UserContext"

function PostPage() {
    const {id} = useParams()
    const [postInfo, setPostInfo] = useState(null)
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