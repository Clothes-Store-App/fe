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
      query: ({ page = 1, limit = 10, search = '', status = '', sort = 'DESC' } = {}) => {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
          sort: sort,
        });

        if (search) params.append('search', search);
        if (status) params.append('status', status);
        
        const requestUrl = `/orders/admin/list?${params.toString()}`;
        
        return {
          url: requestUrl,
          method: 'GET',
          credentials: 'include',
        };
      },
      transformResponse: (response) => {        
        if (!response.success) {
          console.error('❌ API Error:', {
            success: response.success,
            message: response.message,
            data: response.data
          });
          throw new Error(response.message || 'Failed to fetch orders');
        }
        
        if (!response.data) {
          console.error('❌ Invalid response structure:', response);
          throw new Error('Invalid response structure from server');
        }

        const transformedData = {
          data: {
            orders: Array.isArray(response.data.orders) ? response.data.orders : [],
            totalItems: Number(response.data.totalItems) || 0,
            currentPage: Number(response.data.currentPage) || 1,
            totalPages: Number(response.data.totalPages) || 1,
          }
        };
        
        return transformedData;
      },
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const result = await queryFulfilled;
        } catch (error) {
          console.error('💥 Query Error:', {
            error: error.error,
            message: error.message,
            stack: error.stack
          });
        }
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
