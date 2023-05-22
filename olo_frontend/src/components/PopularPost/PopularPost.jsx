import React, { useEffect, useState } from 'react';
import axios from '../../axios';
import { Post } from '../Post/index';
import { useSelector } from 'react-redux';

const PopularPosts = () => {
    const [posts, setPosts] = useState([]);
    const userData = useSelector(state => state.auth.data);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await axios.get('http://localhost:4444/posts');
                const sortedPosts = res.data.sort((a, b) => b.viewsCount - a.viewsCount);
                
                const postsWithCommentsCount = await Promise.all(
                    sortedPosts.map(async post => {
                        const res = await axios.get(`http://localhost:4444/posts/${post._id}/comments`);
                        return {
                            ...post,
                            commentsCount: res.data.length
                        };
                    })
                );
                setPosts(postsWithCommentsCount);
            } catch (err) {
                console.error('Ошибка при загрузке популярных постов: ', err);
            }
        };
        
        fetchPosts();
    }, []);
    

    const handleDelete = (id) => {
        setPosts(posts.filter(post => post._id !== id));
    };
      

    return (
        <div>
            {posts.map((post) => (
                <Post
                    key={post._id}
                    id={post._id}
                    title={post.title}
                    imageUrl={post.imageUrl ? `http://localhost:4444${post.imageUrl}` : ''}
                    user={post.user}
                    createdAt={post.createdAt}
                    viewsCount={post.viewsCount}
                    commentsCount={post.commentsCount} 
                    tags={post.tags}
                    isEditable={userData?._id === post.user._id}
                    onDelete={handleDelete}  
                />
            ))}
        </div>
    );
};

export default PopularPosts;
