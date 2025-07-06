import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
};

export const analyticsApi = createApi({
  reducerPath: 'analyticsApi',
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
  tagTypes: ['Analytics'],
  endpoints: (builder) => ({
    // Lấy tổng quan dashboard
    getDashboardOverview: builder.query({
      query: ({ fromDate, toDate, year } = {}) => ({
        url: '/analytics/overview',
        params: { fromDate, toDate, year }
      }),
      providesTags: ['Analytics'],
      transformResponse: (response) => {
        if (!response?.data) return {
          totalRevenue: 0,
          totalOrders: 0,
          totalProducts: 0,
          pendingOrders: 0
        };
        return response.data;
      },
    }),

    // Lấy thống kê đơn hàng theo thời gian
    getOrderStatistics: builder.query({
      query: ({ fromDate, toDate, year } = {}) => ({
        url: '/analytics/orders/statistics',
        params: { fromDate, toDate, year }
      }),
      providesTags: ['Analytics'],
      transformResponse: (response) => {
        if (!response?.data) return {
          labels: [],
          datasets: [{
            label: 'Số đơn hàng',
            data: []
          }, {
            label: 'Doanh thu',
            data: []
          }]
        };
        return response.data;
      },
    }),

    // Lấy thống kê trạng thái đơn hàng
    getOrderStatusStatistics: builder.query({
      query: ({ fromDate, toDate, year } = {}) => ({
        url: '/analytics/orders/status',
        params: { fromDate, toDate, year }
      }),
      providesTags: ['Analytics'],
      transformResponse: (response) => {
        if (!response?.data) return {
          labels: [],
          datasets: [{
            data: [],
            backgroundColor: []
          }]
        };
        return response.data;
      },
    }),

    // Lấy top sản phẩm bán chạy
    getTopSellingProducts: builder.query({
      query: (limit = 5) => ({
        url: '/analytics/products/top-selling',
        params: { limit }
      }),
      providesTags: ['Analytics'],
      transformResponse: (response) => {
        if (!response?.data) return [];
        // Lọc bỏ các sản phẩm null hoặc không có tên
        return response.data.filter(product => 
          product && 
          product.name && 
          product.totalQuantity !== null && 
          product.totalRevenue !== null
        );
      },
    }),
  }),
});

export const {
  useGetDashboardOverviewQuery,
  useGetOrderStatisticsQuery,
  useGetOrderStatusStatisticsQuery,
  useGetTopSellingProductsQuery,
} = analyticsApi; 