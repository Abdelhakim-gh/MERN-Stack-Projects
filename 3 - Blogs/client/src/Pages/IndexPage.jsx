import React, { useEffect, useState } from 'react'
import Post from '../components/Post'

function IndexPage() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const url = (import.meta.env.VITE_SERVER_URL || 'http://localhost:3001') + '/api/blogs';
    fetch(url).then(response => {
      response.json().then(posts => {
        setPosts(posts);
        console.log(posts); // This logs the fetched posts
      })
    })
  }, []);

  return (
    <>
      {posts.length > 0 ? (
        posts.map(post => (
          <Post key={post._id} {...post} />
        ))
      ) : (
        <h2>No Blogs available</h2>
      )}
    </>
  );
  
}

export default IndexPage;
