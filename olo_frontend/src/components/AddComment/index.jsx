import React, { useState } from "react";
import axios from "../../axios";
import { fetchComments } from '../../redux/slices/posts';
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";

import styles from "./AddComment.module.scss";

import TextField from "@mui/material/TextField";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";

export const Index = () => {
  const { id: postId } = useParams();  
  const [commentText, setCommentText] = useState("");
  const dispatch = useDispatch();
  
  const submitComment = async (event) => {
    event.preventDefault();
    try {
      await axios.post(`http://localhost:4444/posts/${postId}/comments`, {
        text: commentText,
        post: postId,
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setCommentText('');
      dispatch(fetchComments(postId)); 
    } catch (err) {
      console.error('Ошибка при отправке комментария: ', err);
    }
  };

  return (
    <>
      <div className={styles.root}>
        <Avatar
          classes={{ root: styles.avatar }}
          src="/noavatar.png"
        />
        <form className={styles.form} onSubmit={submitComment}>
          <TextField
            label="Написать комментарий"
            variant="outlined"
            maxRows={10}
            multiline
            fullWidth
            value={commentText}
            onChange={e => setCommentText(e.target.value)}
          />
          <Button variant="contained" type="submit">Отправить</Button>
        </form>
      </div>
    </>
  );
};