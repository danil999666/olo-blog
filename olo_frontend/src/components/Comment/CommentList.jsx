import React from 'react';
import Comment from './Comment';

const CommentsList = ({ comments }) => (
  <div>
    {comments.map(comment => (
      <Comment key={comment._id} {...comment} />
    ))}
  </div>
);


export default CommentsList;
