import {format} from 'date-fns'
import {Link} from 'react-router-dom'

export function formatFilePath(filePath) {
  // Remove the 'server' prefix
  let formattedPath = filePath.replace(/^server/, '');

  // Replace backslashes with forward slashes
  formattedPath = formattedPath.replace(/\\/g, '/');

  return formattedPath;
}

function Post({_id, title, summary, content, cover, createdAt, author}) {
  return (
    <>
        <div className="post">
          <div className='image'>
          <Link to={`/blog/${_id}`}>
              <img 
                className="post-image" 
                src={'http://localhost:3001' + formatFilePath(cover)}
                alt="cover page" 
              />
            </Link>
          </div>
          <div className='texts'>
            <Link to={`/blog/${_id}`}>
              <h2>{title || 'No Title'}</h2>
            </Link>
            <p className="info">
              <a className='author' href="#">{author.username}</a>
              <time>{format(new Date(createdAt), 'MMM dd, yyyy HH:mm')}</time>
            </p>
            <p className='summary'>
              {summary || 'No Summary'}
            </p>
          </div>
        </div>
    </>
  )
}

export default Post