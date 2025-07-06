import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

// Hàm lấy cookie (access_token)
const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
};

export const bannerApi = createApi({
  reducerPath: 'bannerApi',
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
  tagTypes: ['Banners'],
  endpoints: (builder) => ({
    // Lấy tất cả banner (cho người dùng)
    getBanners: builder.query({
      query: () => ({
        url: '/banners',
        method: 'GET',
      }),
      providesTags: ['Banners'],
    }),

    // Lấy một banner đang active
    getActiveBanner: builder.query({
      query: () => ({
        url: '/banners/one',
        method: 'GET',
      }),
      providesTags: ['Banners'],
    }),

    // Lấy tất cả banner (cho admin)
    getBannersByAdmin: builder.query({
      query: ({ page = 1, limit = 10, search = '' } = {}) => ({
        url: '/banners/admin/list',
        method: 'GET',
        params: { page, limit, search }
      }),
      providesTags: ['Banners'],
    }),

    // Lấy banner theo ID
    getBannerById: builder.query({
      query: (id) => ({
        url: `/banners/${id}`,
        method: 'GET',
      }),
      providesTags: ['Banners'],
    }),

    // Tạo banner mới (có hình ảnh)
    createBanner: builder.mutation({
      query: (data) => {
        const formData = new FormData();
        if (data.image instanceof File) {
          formData.append('image', data.image);
        }
        formData.append('title', data.title);
        formData.append('description', data.description);
        formData.append('status', data.status);

        return {
          url: '/banners',
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: ['Banners'],
    }),

    // Cập nhật banner
    updateBanner: builder.mutation({
      query: ({ id, ...data }) => {
        const formData = new FormData();
        if (data.image instanceof File) {
          formData.append('image', data.image);
        }
        formData.append('title', data.title);
        formData.append('description', data.description);
        formData.append('status', data.status);

        return {
          url: `/banners/${id}`,
          method: 'PUT',
          body: formData,
        };
      },
      invalidatesTags: ['Banners'],
    }),

    // Xoá banner
    deleteBanner: builder.mutation({
      query: (id) => ({
        url: `/banners/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Banners'],
    }),
  }),
});

export const {
  useGetBannersQuery,
  useGetActiveBannerQuery,
  useGetBannersByAdminQuery,
  useGetBannerByIdQuery,
  useCreateBannerMutation,
  useUpdateBannerMutation,
  useDeleteBannerMutation,
} = bannerApi; 