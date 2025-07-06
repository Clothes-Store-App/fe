import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

export const chatbotApi = createApi({
  reducerPath: 'chatbotApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: BASE_URL,
    credentials: 'include',
  }),
  tagTypes: ['ChatMessages'],
  endpoints: (builder) => ({
    // Gửi tin nhắn và nhận phản hồi từ bot
    sendMessage: builder.mutation({
      query: (message) => ({
        url: '/chatbot/message',
        method: 'POST',
        body: message,
      }),
      invalidatesTags: ['ChatMessages'],
    }),

    // Tìm kiếm sản phẩm theo từ khóa
    searchProducts: builder.query({
      query: (query) => `/chatbot/search?query=${encodeURIComponent(query)}`,
      providesTags: ['ChatMessages'],
    }),

    // Gợi ý sản phẩm theo danh mục
    suggestProducts: builder.query({
      query: (category) => `/chatbot/suggest?category=${encodeURIComponent(category)}`,
      providesTags: ['ChatMessages'],
    }),

    // Lấy thông tin bot
    getBotInfo: builder.query({
      query: () => '/chatbot/info',
    }),

    // Health check
    healthCheck: builder.query({
      query: () => '/chatbot/health',
    }),
  }),
});

export const {
  useSendMessageMutation,
  useSearchProductsQuery,
  useSuggestProductsQuery,
  useGetBotInfoQuery,
  useHealthCheckQuery,
} = chatbotApi; 