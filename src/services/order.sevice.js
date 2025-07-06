import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
};

export const orderApi = createApi({
  reducerPath: 'orderApi',
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
  tagTypes: ['Orders'],
  endpoints: (builder) => ({
    // Lấy danh sách đơn hàng với phân trang
    getOrders: builder.query({
      query: () => ({
        url: '/orders',
        method: 'GET',
      }),
      providesTags: ['Orders'],
    }),

    getOrdersByAdmin: builder.query({
      query: ({ page = 1, limit = 10, search = '', status = '', sort = 'ASC' } = {}) => {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
          sort: sort,
        });

        if (search) params.append('search', search);
        if (status) params.append('status', status);
        
        return `/orders/admin/list?${params.toString()}`;
      },
      providesTags: ['Orders'],
    }),

    // POST /api/orders - Tạo đơn hàng mới
    createOrder: builder.mutation({
      query: (data) => ({
        url: '/orders',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Orders'],
    }),

    // PUT /api/orders/:id - Cập nhật trạng thái đơn hàng
    updateOrder: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/orders/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Orders'],
    }),

    // DELETE /api/orders/:id - Xóa đơn hàng
    deleteOrder: builder.mutation({
      query: (id) => ({
        url: `/orders/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Orders'],
    }),
  }),
});

export const {
  useGetOrdersQuery,
  useGetOrdersByAdminQuery,
  useCreateOrderMutation,
  useUpdateOrderMutation,
  useDeleteOrderMutation,
} = orderApi;
