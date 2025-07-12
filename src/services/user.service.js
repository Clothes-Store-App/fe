import { api } from './api';

export const userApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getUsersByAdmin: builder.query({
      query: () => ({
        url: '/users',
        method: 'GET'
      }),
      providesTags: ['Users']
    }),
  })
});

export const {
  useGetUsersByAdminQuery
} = userApi; 