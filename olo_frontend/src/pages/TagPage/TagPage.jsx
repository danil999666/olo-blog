import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../../axios";
import { Post } from '../../components/Post/index';


const TagPage = () => {
  const { tag } = useParams();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`http://localhost:4444/posts/tags/${tag}`);
        setPosts(response.data);
      } catch (error) {
        console.error('Ошибка при загрузке постов с тегом: ', error);
        if (error.response) {
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          console.log(error.request);
        } else {
          console.log('Error', error.message);
        }
        console.log(error.config);
      }
    };
  
    fetchPosts();
  }, [tag]);
  


  return (
    <div>
      {posts.map((post) => (
        <Post key={post.id} {...post} />
      ))}
    </div>
  );
};

export default TagPage;
