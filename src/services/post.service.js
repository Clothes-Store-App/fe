import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { api } from './api';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

export const postApi = createApi({
  reducerPath: 'postApi',
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    credentials: 'include',
  }),
  tagTypes: ['Posts'],
  endpoints: (builder) => ({
    // Tạo bài viết mới
    createPost: builder.mutation({
      query: (data) => ({
        url: '/posts',
        method: 'POST',
        body: data,
        formData: true,
      }),
      invalidatesTags: ['Posts'],
    }),
    // Cập nhật bài viết
    updatePost: builder.mutation({
      query: ({ id, body }) => ({
        url: `/posts/${id}`,
        method: 'PUT',
        body,
        formData: true,
      }),
      invalidatesTags: ['Posts'],
    }),
    // Lấy danh sách bài viết với phân trang, filter
    getPosts: builder.query({
      query: (params = {}) => ({
        url: '/posts',
        method: 'GET',
        params,
      }),
      providesTags: ['Posts'],
    }),
    // Lấy bài viết đã xuất bản (public)
    getPublishedPosts: builder.query({
      query: (params = {}) => ({
        url: '/posts/published',
        method: 'GET',
        params,
      }),
      providesTags: ['Posts'],
    }),
    // Lấy chi tiết bài viết
    getPostById: builder.query({
      query: (id) => `/posts/${id}`,
      providesTags: ['Posts'],
    }),
    // Xóa bài viết
    deletePost: builder.mutation({
      query: (id) => ({
        url: `/posts/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Posts'],
    }),
    // Cập nhật trạng thái bài viết
    updatePostStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/posts/${id}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: ['Posts'],
    }),
    // Toggle featured
    toggleFeatured: builder.mutation({
      query: (id) => ({
        url: `/posts/${id}/featured`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Posts'],
    }),
    // Upload image cho React Quill
    uploadImage: builder.mutation({
      query: (file) => {
        const formData = new FormData();
        formData.append('image', file);
        return {
          url: '/posts/upload-image',
          method: 'POST',
          body: formData,
        };
      },
    }),
    // Sinh nội dung AI cho bài viết
    generateAIContent: builder.mutation({
      query: (body) => ({
        url: '/posts/generate-ai-content',
        method: 'POST',
        body,
      }),
    }),
    // Lấy bài viết theo slug
    getPostBySlug: builder.query({
      query: (slug) => `/posts/slug/${slug}`,
    }),
  }),
});

export const {
  useCreatePostMutation,
  useUpdatePostMutation,
  useGetPostsQuery,
  useGetPublishedPostsQuery,
  useGetPostByIdQuery,
  useDeletePostMutation,
  useUpdatePostStatusMutation,
  useToggleFeaturedMutation,
  useUploadImageMutation,
  useGenerateAIContentMutation,
  useGetPostBySlugQuery,
} = postApi; 