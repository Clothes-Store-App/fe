import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

export const voucherApi = createApi({
  reducerPath: 'voucherApi',
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    credentials: 'include',
  }),
  tagTypes: ['Vouchers'],
  endpoints: (builder) => ({
    // Lấy danh sách voucher (admin)
    getVouchersByAdmin: builder.query({
      query: ({ page = 1, limit = 10, search = '' } = {}) => {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
        });
        if (search) params.append('search', search);
        return `/vouchers?${params.toString()}`;
      },
      providesTags: ['Vouchers'],
    }),
    // Lấy voucher theo id
    getVoucherById: builder.query({
      query: (id) => `/vouchers/${id}`,
      providesTags: ['Vouchers'],
    }),
    // Tạo voucher mới
    createVoucher: builder.mutation({
      query: (data) => ({
        url: '/vouchers',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Vouchers'],
    }),
    // Cập nhật voucher
    updateVoucher: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/vouchers/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Vouchers'],
    }),
    // Xóa voucher
    deleteVoucher: builder.mutation({
      query: (id) => ({
        url: `/vouchers/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Vouchers'],
    }),
  }),
});

export const {
  useGetVouchersByAdminQuery,
  useGetVoucherByIdQuery,
  useCreateVoucherMutation,
  useUpdateVoucherMutation,
  useDeleteVoucherMutation,
} = voucherApi; 