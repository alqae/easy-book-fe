import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import {
  ApiResponse,
  AuthenticationSuccessResponse,
  ForgotPasswordRequest,
  LoginRequest,
  RegisterRequest,
  ResetPasswordRequest,
} from '@/types/requests';
import { Country, City } from '@/types/models';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:8080',
    prepareHeaders: (headers) => {
      const accessToken = localStorage.getItem('token');
      if (accessToken) {
        headers.set('authorization', `Bearer ${accessToken}`);
        headers.set('Content-Type', 'application/json');
      }

      return headers;
    },
  }),
  endpoints: (builder) => ({
    login: builder.mutation<ApiResponse<AuthenticationSuccessResponse>, LoginRequest>({
      query: (data) => ({
        url: '/auth/login',
        method: 'POST',
        body: data,
      }),
    }),
    register: builder.mutation<ApiResponse<AuthenticationSuccessResponse>, RegisterRequest>({
      query: (data) => ({
        url: '/auth/register',
        method: 'POST',
        body: data,
      }),
    }),
    forgotPassword: builder.mutation<ApiResponse<void>, ForgotPasswordRequest>({
      query: (data) => ({
        url: '/auth/forgot-password',
        method: 'POST',
        body: data,
      }),
    }),
    resetPassword: builder.mutation<ApiResponse<void>, ResetPasswordRequest>({
      query: (data) => ({
        url: '/auth/reset-password',
        method: 'POST',
        body: data,
      }),
    }),
    getCountries: builder.query<Country[], void>({
      query: () => '/shared/countries',
      transformResponse: (response: ApiResponse<Country[]>) => response.data,
    }),
    getCitiesByCountry: builder.query<City[], Country['country']>({
      query: (country) => `/shared/cities/${country}`,
      transformResponse: (response: ApiResponse<City[]>) => response.data,
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useGetCountriesQuery,
  useGetCitiesByCountryQuery,
  useLazyGetCitiesByCountryQuery,
} = api;
