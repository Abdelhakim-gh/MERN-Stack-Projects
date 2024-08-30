import { useState, useEffect, useContext } from "react";
import { UserContext } from "../UserContext";
import { Link } from "react-router-dom";
import { format } from 'date-fns';

function UserPosts() {
  const [posts, setPosts] = useState([]);
  const { userInfo } = useContext(UserContext);

  useEffect(() => {
    const fetchPosts = async () => {
      // Ensure userInfo is available before fetching posts
      if (userInfo?.id) {
        const url = (import.meta.env.VITE_SERVER_URL || 'http://localhost:3001') + '/api/blogs?id=' + userInfo.id;
        
        try {
          const response = await fetch(url, {
            credentials: 'include',
            method: 'GET',
          });
          if (response.ok) {
            const data = await response.json();
            setPosts(data); // Set posts state with fetched data
          } else {
            console.error('Failed to fetch posts:', response.statusText);
          }
        } catch (error) {
          console.error('Error fetching posts:', error);
        }
      }
    };

    fetchPosts();
  }, [userInfo]);

  const deletePost = (id) => {
    const url = (import.meta.env.VITE_SERVER_URL || 'http://localhost:3001') + '/api/blog/delete/' + id;
    fetch(url, {
        method: 'DELETE',
        credentials: 'include'
    }).then((response) => {
        if (response.ok) {
            console.log('Post deleted successfully');
            // Optionally, remove the deleted post from the state
            setPosts(posts.filter(post => post._id !== id));
        } else {
            console.error('Failed to delete post');
        }
    }).catch(error => console.error('Error deleting post:', error));
  }

  return (
    <>
      <div className="my-blogs">
        <table className="table">
          <caption className="caption">My Blogs</caption>
          <thead>
            <tr>
              <th>Title</th>
              <th>Created AT</th>
              <th>Last Update</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.length > 0 ? (
              posts.map((post) => (
                <tr key={post._id}>
                  <td className="label">{post.title}</td>
                  <td><time>{format(new Date(post.createdAt), 'MMM dd, yyyy HH:mm')}</time></td>
                  <td><time>{format(new Date(post.updatedAt), 'MMM dd, yyyy HH:mm')}</time></td>
                  <td>
                    <Link to={`/blog/${post._id}`}>View</Link>
                    <Link to={`/blog/edit/${post._id}`}>Edit</Link>
                    <a 
                      href="#!" 
                      onClick={() => deletePost(post._id)} 
                    >
                      Delete
                    </a>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">No posts available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default UserPosts;
