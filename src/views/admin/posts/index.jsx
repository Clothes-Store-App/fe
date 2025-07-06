import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PostList from './PostList';
import PostFormCreate from './PostFormCreate';
import PostFormEdit from './PostFormEdit';
import PostDetail from './PostDetail';

const PostModule = () => {
  return (
    <Routes>
      <Route index element={<PostList />} />
      <Route path="add" element={<PostFormCreate />} />
      <Route path="edit/:id" element={<PostFormEdit />} />
      <Route path="detail/:id" element={<PostDetail />} />
    </Routes>
  );
};

export { PostList, PostFormCreate, PostFormEdit, PostDetail };

export default PostModule; 