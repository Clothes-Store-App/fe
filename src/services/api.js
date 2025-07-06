import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// BASE_URL from environment variables
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

// Hàm để lấy cookie theo tên
const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
};

// Tạo API với RTK Query
export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ 
    baseUrl: BASE_URL,
    prepareHeaders: (headers) => {
      // Lấy token từ cookies
      const token = getCookie('access_token');
      
      // Nếu có token, thêm vào headers
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      
      return headers;
    },
    credentials: 'include', // Đảm bảo cookies được gửi kèm trong mọi request
  }),
  tagTypes: ['Products', 'Orders', 'Users'],
  endpoints: (builder) => ({
    // Auth endpoints
    login: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
        credentials: 'include', // Đảm bảo cookies được lưu sau khi đăng nhập
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
    }),
    
    // Lấy tất cả sản phẩm
    getProducts: builder.query({
      query: () => '/products',
      providesTags: ['Products'],
    }),
    
    // Lấy sản phẩm theo ID
    getProduct: builder.query({
      query: (id) => `/products/${id}`,
      providesTags: ['Products'],
    }),
    
    // Lấy sản phẩm nổi bật
    getFeaturedProducts: builder.query({
      query: () => '/products/featured',
    }),
    
    // Lấy sản phẩm theo danh mục
    getProductsByCategory: builder.query({
      query: (category) => `/products/category/${category}`,
    }),
    
    // Tìm kiếm sản phẩm
    searchProducts: builder.query({
      query: (searchTerm) => `/products/search?q=${searchTerm}`,
    }),
    
    // Order endpoints
    getOrders: builder.query({
      query: () => '/orders',
      providesTags: ['Orders'],
    }),
    
    getUserOrders: builder.query({
      query: () => '/orders/user',
      providesTags: ['Orders'],
    }),
    
    createOrder: builder.mutation({
      query: (order) => ({
        url: '/orders',
        method: 'POST',
        body: order,
      }),
      invalidatesTags: ['Orders'],
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useGetProductsQuery,
  useGetProductQuery,
  useGetFeaturedProductsQuery,
  useGetProductsByCategoryQuery,
  useSearchProductsQuery,
  useGetOrdersQuery,
  useGetUserOrdersQuery,
  useCreateOrderMutation,
} = api; 