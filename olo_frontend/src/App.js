import { Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Container from "@mui/material/Container";

import { Header } from "./components";
import { Home, FullPost, Registration, AddPost, Login } from "./pages";
import React from 'react';
import { fetchAuthMe, selectIsAuth } from './redux/slices/auth';
import TagPage from './pages/TagPage/TagPage';


function App() {
  const dispatch = useDispatch();
  const isAuth = useSelector(selectIsAuth);

  React.useEffect(() => {
    dispatch(fetchAuthMe());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Header />
      <Container maxWidth="lg">
        <Routes>
          <Route path="/" element= {<Home />} />
          <Route path="/posts/:id" element= {<FullPost />} />
          <Route path="/posts/:id/edit" element= {<AddPost />} />
          <Route path="/add-post" element= {<AddPost />} />
          <Route path="/login" element= {<Login />} />
          <Route path="/register" element= {<Registration />} />
          <Route path="/tags/:tagName" element={<TagPage />} />
        </Routes>
      </Container>
    </>
  );
}

export default App;


