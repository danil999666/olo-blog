import React from 'react';

const Comment = ({ user, text }) => (
  <div>
    <p>{user}: {text}</p>
  </div>
);

export default Comment;
