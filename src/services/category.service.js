import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

// Tạo API với RTK Query
export const categoryApi = createApi({
  reducerPath: 'categoryApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: BASE_URL,
    credentials: 'include', // Đảm bảo cookies được gửi kèm trong mọi request
  }),
  tagTypes: ['Categories'],
  endpoints: (builder) => ({
    // Lấy danh sách danh mục với phân trang
    getCategories: builder.query({
      query: () => ({
        url: '/categories',
        method: 'GET',
      }),
      providesTags: ['Categories'],
    }),

    getCategoriesByAdmin: builder.query({
      query: ({ page = 1, limit = 10, search = '' } = {}) => {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
        });

        if (search) params.append('search', search);
        return `/categories/admin/list?${params.toString()}`;
      },
      providesTags: ['Categories'],
    }),
    
    // Tạo danh mục mới với hình ảnh
    createCategory: builder.mutation({
      query: (data) => {
        const formData = new FormData();
        // Nếu có file hình ảnh, thêm vào formData
        if (data.image instanceof File) {
          formData.append('image', data.image);
        }
        // Thêm các trường dữ liệu khác
        formData.append('name', data.name);

        return {
          url: '/categories',
          method: 'POST',
          body: formData,
          // Không set Content-Type vì browser sẽ tự set với boundary cho FormData
        };
      },
      invalidatesTags: ['Categories'],
    }),
    
    // Cập nhật danh mục với hình ảnh
    updateCategory: builder.mutation({
      query: ({ id, ...data }) => {
        const formData = new FormData();
        // Nếu có file hình ảnh mới, thêm vào formData
        if (data.image instanceof File) {
          formData.append('image', data.image);
        }
        // Thêm các trường dữ liệu khác
        formData.append('name', data.name);

        return {
          url: `/categories/${id}`,
          method: 'PUT',
          body: formData,
          // Không set Content-Type vì browser sẽ tự set với boundary cho FormData
        };
      },
      invalidatesTags: ['Categories'],
    }),
    
    // Xóa danh mục
    deleteCategory: builder.mutation({
      query: (id) => ({
        url: `/categories/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Categories'],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useGetCategoriesByAdminQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoryApi; 