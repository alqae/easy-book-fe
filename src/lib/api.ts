import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { isRejectedWithValue, Middleware } from '@reduxjs/toolkit';

import { Country, City, User } from '@/types/models';
import { toast } from '@/components/ui/use-toast';
import { UserRole } from '@/types/enums';
import {
  ApiResponse,
  AuthenticationSuccessResponse,
  ForgotPasswordRequest,
  LoginRequest,
  RegisterRequest,
  ResetPasswordRequest,
  UpdatePasswordRequest,
  UpdateProfileRequest,
} from '@/types/requests';

export const rtkQueryErrorLogger: Middleware = () => (next) => (action: any) => {
  if (isRejectedWithValue(action) && 'status' in action.payload && 'data' in action.payload) {
    let description = '';

    if (action.payload.data) {
      description = action.payload.data.message;
    } else {
      description =
        'data' in action.error ? (action.error.data as ApiResponse).message : action.error.message;
    }

    toast({ title: 'Error', variant: 'destructive', description });
  }

  return next(action);
};

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:8080',
    prepareHeaders: (headers) => {
      const accessToken = localStorage.getItem('accessToken');

      if (accessToken) {
        headers.set('Authorization', `Bearer ${accessToken}`);
      }

      headers.set('Content-Type', 'application/json');

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
    getProfile: builder.mutation<User, void>({
      query: () => '/profile',
    }),
    updateProfile: builder.mutation<ApiResponse<void>, UpdateProfileRequest>({
      query: (data) => ({
        url: '/profile',
        method: 'PATCH',
        body: data,
      }),
    }),
    updatePassword: builder.mutation<ApiResponse<void>, UpdatePasswordRequest>({
      query: (data) => ({
        url: '/profile/password',
        method: 'PATCH',
        body: data,
      }),
    }),
    updateRole: builder.mutation<ApiResponse<void>, UserRole>({
      query: (data) => ({
        url: `/profile/role/${data}`,
        method: 'PATCH',
      }),
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
  useUpdateProfileMutation,
  useUpdatePasswordMutation,
  useUpdateRoleMutation,
} = api;
