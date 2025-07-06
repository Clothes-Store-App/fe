import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// BASE_URL cho API thực
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

// Hàm để lấy cookie theo tên
const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
};

// Tạo API với RTK Query cho products
export const productsApi = createApi({
  reducerPath: 'productsApi',
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
  tagTypes: ['Products'],
  endpoints: (builder) => ({
    // Tạo sản phẩm mới
    createProduct: builder.mutation({
      query: (data) => ({
        url: '/products',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Products'],
    }),

    // Cập nhật sản phẩm
    updateProduct: builder.mutation({
      query: ({ id, body }) => ({
        url: `/products/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Products'],
    }),

    // Lấy danh sách sản phẩm với phân trang
    getProducts: builder.query({
      query: () => ({
        url: `/products/`,
        method: 'GET',
      }),
      providesTags: ['Products'],
    }),

    getProductsByAdmin: builder.query({
      query: ({ page = 1, limit = 10, search = '', category_id = null }) => {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
        });

        if (search) params.append('search', search);
        if (category_id) params.append('category_id', category_id.toString());

        return `/products/admin/list?${params.toString()}`;
      },
      providesTags: ['Products'],
    }),

    getProductById: builder.query({
      query: (id) => `/products/${id}`,
      providesTags: ['Products'],
    }),

    // Xóa sản phẩm
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/products/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Products'],
    }),

    // Lấy sản phẩm đang bán
    getSellingProducts: builder.query({
      query: () => ({
        url: '/products/selling',
        method: 'GET',
      }),
      providesTags: ['Products'],
    }),
  }),
});

export const {
  useCreateProductMutation,
  useUpdateProductMutation,
  useGetProductsQuery,
  useGetProductsByAdminQuery,
  useDeleteProductMutation,
  useGetProductByIdQuery,
  useGetSellingProductsQuery,
} = productsApi;
