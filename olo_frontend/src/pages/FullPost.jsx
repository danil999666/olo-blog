import React from "react";
import { useParams } from "react-router-dom";
import ReactMarkdown from 'react-markdown'
import axios from "../axios";

import { Post } from "../components/Post";
import { Index } from "../components/AddComment";
import { CommentsBlock } from "../components/CommentsBlock";

function transformComment(comment) {
  return {
    _id: comment._id,
    user: {
      fullName: comment.author,
      avatarUrl: "https://via.placeholder.com/150"
    },
    text: comment.text
  }
}


export const FullPost = () => {
  const [data, setData] = React.useState();
  const [comments, setComments] = React.useState([]);
  const [isLoadingPost, setLoadingPost] = React.useState(true);
  const [isLoadingComments, setLoadingComments] = React.useState(true);
  const { id } = useParams();


  React.useEffect(() => {
    axios
      .get(`/posts/${id}`)
      .then(res => {
        setData(res.data);
        setLoadingPost(false);
      })
      .catch(err => {
        console.warn(err);
        alert('Ошибка при получении статьи');
      });

    axios
      .get(`/posts/${id}/comments`)
      .then(res => {
        const transformedComments = res.data.map(transformComment);
        setComments(transformedComments);
        setLoadingComments(false);
      })
      .catch(err => {
        console.warn(err);
        alert('Ошибка при получении комментариев');
      }); 

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  if (isLoadingPost) {
    return < Post isLoading={isLoadingPost} isFullPost />;
  }

  return (
    <>
      <Post
        id={data._id}
        title={data.title}
        imageUrl={data.imageUrl ? `http://localhost:4444${data.imageUrl}`: ''}
        user={data.user}
        createdAt={data.createdAt}
        viewsCount={data.viewsCount}
        commentsCount={comments.length}
        tags={data.tags}
        isFullPost>
        <ReactMarkdown children={data.text} />
      </Post>
      <CommentsBlock
        items={comments}
        isLoading={false}
        >
        <Index />
      </CommentsBlock>
    </>
  );
};
