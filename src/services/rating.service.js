import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Lấy BASE_URL từ biến môi trường
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

// Hàm để lấy cookie theo tên
const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
};

// Tạo API với RTK Query cho ratings
export const ratingsApi = createApi({
  reducerPath: 'ratingsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers) => {
      const token = getCookie('access_token');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
    credentials: 'include',
  }),
  tagTypes: ['Ratings'],
  endpoints: (builder) => ({
    // Lấy tất cả đánh giá (admin only)
    getAllRatings: builder.query({
      query: () => ({
        url: '/ratings/admin/list',
        method: 'GET',
      }),
      providesTags: ['Ratings'],
      transformResponse: (response) => {
        console.log('Dữ liệu đánh giá từ API:', response);
        return response;
      },
    }),

    // Lấy đánh giá theo sản phẩm
    getRatingsByProduct: builder.query({
      query: (productId) => ({
        url: `/ratings/product/${productId}`,
        method: 'GET',
      }),
      providesTags: ['Ratings'],
      transformResponse: (response) => {
        console.log('Đánh giá của sản phẩm:', response);
        return response;
      },
    }),

    // Xóa đánh giá
    deleteRating: builder.mutation({
      query: (id) => ({
        url: `/ratings/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Ratings'],
    }),

    // Cập nhật đánh giá
    updateRating: builder.mutation({
      query: ({ id, data }) => ({
        url: `/ratings/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Ratings'],
    }),
  }),
});

// Export các hooks để sử dụng
export const {
  useGetAllRatingsQuery,
  useGetRatingsByProductQuery,
  useDeleteRatingMutation,
  useUpdateRatingMutation,
} = ratingsApi; 