import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

// Hàm lấy cookie (access_token)
const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
};

export const sliderApi = createApi({
  reducerPath: 'sliderApi',
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    credentials: 'include',
    prepareHeaders: (headers) => {
      const token = getCookie('access_token');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Sliders'],
  endpoints: (builder) => ({
    // Lấy tất cả slider (cho người dùng)
    getSliders: builder.query({
      query: () => ({
        url: '/sliders',
        method: 'GET',
      }),
      providesTags: ['Sliders'],
    }),

    // Lấy tất cả slider (cho admin)
    getSlidersByAdmin: builder.query({
      query: () => ({
        url: '/sliders/admin/list',
        method: 'GET',
      }),
      providesTags: ['Sliders'],
    }),

    // Tạo slider mới (có hình ảnh)
    createSlider: builder.mutation({
      query: (data) => {
        const formData = new FormData();
        if (data.image instanceof File) {
          formData.append('image', data.image);
        }
        formData.append('order', data.order);
        formData.append('status', data.status);

        return {
          url: '/sliders',
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: ['Sliders'],
    }),

    // Cập nhật slider
    updateSlider: builder.mutation({
      query: ({ id, ...data }) => {
        const formData = new FormData();
        if (data.image instanceof File) {
          formData.append('image', data.image);
        }
        formData.append('order', data.order);
        formData.append('status', data.status);

        return {
          url: `/sliders/${id}`,
          method: 'PUT',
          body: formData,
        };
      },
      invalidatesTags: ['Sliders'],
    }),

    // Xoá slider
    deleteSlider: builder.mutation({
      query: (id) => ({
        url: `/sliders/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Sliders'],
    }),
  }),
});

export const {
  useGetSlidersQuery,
  useGetSlidersByAdminQuery,
  useCreateSliderMutation,
  useUpdateSliderMutation,
  useDeleteSliderMutation,
} = sliderApi;
