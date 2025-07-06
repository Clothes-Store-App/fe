import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

export const videoApi = createApi({
  reducerPath: 'videoApi',
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    credentials: 'include', // Gửi cookie kèm request
  }),
  tagTypes: ['Videos'],
  endpoints: (builder) => ({
    // Lấy danh sách video
    getVideos: builder.query({
      query: () => ({
        url: '/videos',
        method: 'GET',
      }),
      providesTags: ['Videos'],
    }),
    getVideosByAdmin: builder.query({
      query: () => ({
        url: '/videos/admin/list',
        method: 'GET',
      }),
      providesTags: ['Videos'],
    }),

    // Tạo video mới
    createVideo: builder.mutation({
      query: (data) => ({
        url: '/videos',
        method: 'POST',
        body: {
          title: data.title,
          url: data.url,
          status: data.status,
        },
      }),
      invalidatesTags: ['Videos'],
    }),

    // Cập nhật video
    updateVideo: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/videos/${id}`,
        method: 'PUT',
        body: {
          title: data.title,
          url: data.url,
          status: data.status,
        },
      }),
      invalidatesTags: ['Videos'],
    }),

    // Xóa video
    deleteVideo: builder.mutation({
      query: (id) => ({
        url: `/videos/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Videos'],
    }),
  }),
});

export const {
  useGetVideosQuery,
  useCreateVideoMutation,
  useUpdateVideoMutation,
  useDeleteVideoMutation,
  useGetVideosByAdminQuery,
} = videoApi;
