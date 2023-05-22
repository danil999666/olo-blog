import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Grid from '@mui/material/Grid';

import { Post } from '../components/Post';
import { TagsBlock } from '../components/TagsBlock';
import { CommentsBlock } from '../components/CommentsBlock';
import   PopularPosts   from '../components/PopularPost/PopularPost'; 
import { fetchPosts, fetchTags, fetchComments } from '../redux/slices/posts';


export const Home = () => {
  const dispatch = useDispatch();
  const userData = useSelector(state => state.auth.data);
  const { posts, tags} = useSelector(state => state.posts);
  const [postsData, setPostsData] = useState([]);


  const isPostsLoading = posts.status === 'loading';
  const isTagsLoading = tags.status === 'loading';

  const [value, setValue] = useState(0); 

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  React.useEffect(()  =>  {
    const fetchPostsWithCommentsCount = async () => {
      const res = await dispatch(fetchPosts()).unwrap();
      const postsWithCommentsCount = await Promise.all(
        res.map(async post => {
          const comments = await dispatch(fetchComments(post._id)).unwrap();
          return {
            ...post,
            commentsCount: comments.length
          };
        })
      );
      setPostsData(postsWithCommentsCount);
    };
  
    fetchPostsWithCommentsCount();
    dispatch(fetchTags());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  

  return (
    <>
      <Tabs 
        style={{ marginBottom: 15 }} 
        value={value} 
        onChange={handleChange} 
        aria-label="basic tabs example"
      >
        <Tab label="Новые" />
        <Tab label="Популярные" />
      </Tabs>
      <Grid container spacing={4}>
        <Grid xs={8} item>
          {value === 0 
            ? (isPostsLoading ? [...Array(5)] : postsData).map((obj, index) => 
              isPostsLoading ? (
                <Post key={index} isLoading={true} />
              ) : (
                <Post
                  id={obj._id}
                  title={obj.title}
                  imageUrl={obj.imageUrl ? `http://localhost:4444${obj.imageUrl}`: ''}
                  user={obj.user}
                  createdAt={obj.createdAt}
                  viewsCount={obj.viewsCount}
                  commentsCount={obj.commentsCount} 
                  tags={obj.tags}
                  isEditable={userData?._id === obj.user._id}
                />
              )
            )
            : <PopularPosts /> 
          }
        </Grid>
        <Grid xs={4} item>
          <TagsBlock items={tags.items} isLoading={isTagsLoading} />
          <CommentsBlock
            items={[
              {
                user: {
                  fullName: 'Abrams',
                  avatarUrl: '/noavatar.png',
                },
                text: 'Это тестовый комментарий',
              },
              {
                user: {
                  fullName: 'Govard',
                  avatarUrl: '/noavatar.png',
                },
                text: 'Это тестовый комментарий',
              },
            ]}
            isLoading={false}
          />
        </Grid>
      </Grid>
    </>
  );
};

