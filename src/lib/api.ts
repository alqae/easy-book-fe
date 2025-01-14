import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { Country, City, User, Service, Reservation } from '@/types/models';
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
  RefreshTokenResponse,
  CreateServiceRequest,
  UpdateServiceRequest,
  SearchCompaniesRequest,
  GetAviableHoursRequest,
  CreateReservationRequest,
  PaginatedResponse,
  PaginatedRequest,
  UpdateReservationRequest,
} from '@/types/requests';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL,
    prepareHeaders: (headers) => {
      const accessToken = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');

      if (accessToken) {
        headers.set('Authorization', `Bearer ${accessToken}`);
        headers.set('Refresh-Token', refreshToken ?? '');
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
    forgotPassword: builder.mutation<ApiResponse, ForgotPasswordRequest>({
      query: (data) => ({
        url: '/auth/forgot-password',
        method: 'POST',
        body: data,
      }),
    }),
    resetPassword: builder.mutation<ApiResponse, ResetPasswordRequest>({
      query: (data) => ({
        url: '/auth/reset-password',
        method: 'POST',
        body: data,
      }),
    }),
    logout: builder.mutation<ApiResponse, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
    }),
    resendVerificationEmail: builder.mutation<ApiResponse, void>({
      query: () => ({
        url: '/auth/resend-verification-email',
        method: 'POST',
      }),
    }),
    refreshToken: builder.mutation<ApiResponse<RefreshTokenResponse>, void>({
      query: () => ({
        url: '/auth/refresh-token',
        method: 'POST',
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
    getProfile: builder.mutation<ApiResponse<User>, void>({
      query: () => '/profile',
    }),
    updateProfile: builder.mutation<ApiResponse, UpdateProfileRequest>({
      query: (data) => ({
        url: '/profile',
        method: 'PATCH',
        body: data,
      }),
    }),
    updatePassword: builder.mutation<ApiResponse, UpdatePasswordRequest>({
      query: (data) => ({
        url: '/profile/password',
        method: 'PATCH',
        body: data,
      }),
    }),
    deleteAccount: builder.mutation<ApiResponse, void>({
      query: () => ({
        url: '/profile',
        method: 'DELETE',
      }),
    }),
    updateRole: builder.mutation<ApiResponse, UserRole>({
      query: (data) => ({
        url: `/profile/role`,
        method: 'PATCH',
        body: { role: data },
      }),
    }),
    createService: builder.mutation<ApiResponse<Service>, CreateServiceRequest>({
      query: (data) => ({
        url: '/services',
        method: 'POST',
        body: data,
      }),
    }),
    updateService: builder.mutation<ApiResponse<Service>, [Service['id'], UpdateServiceRequest]>({
      query: ([id, data]) => ({
        url: `/services/${id}`,
        method: 'PATCH',
        body: data,
      }),
    }),
    deleteService: builder.mutation<ApiResponse, Service['id']>({
      query: (id) => ({
        url: `/services/${id}`,
        method: 'DELETE',
      }),
    }),
    searchCompanies: builder.query<
      ApiResponse<PaginatedResponse<User>>,
      Partial<SearchCompaniesRequest>
    >({
      query: (params) => ({
        url: '/companies',
        params,
      }),
    }),
    getCompanyDetail: builder.query<ApiResponse<User>, User['id']>({
      query: (id) => ({
        url: `/companies/${id}`,
      }),
    }),
    getAviableHoursByDate: builder.query<ApiResponse<string[]>, GetAviableHoursRequest>({
      query: (params) => ({
        url: '/services/aviable-hours',
        params,
      }),
    }),
    createReservation: builder.mutation<ApiResponse, CreateReservationRequest>({
      query: (data) => ({
        url: '/reservations',
        method: 'POST',
        body: data,
      }),
    }),
    getReservations: builder.query<ApiResponse<PaginatedResponse<Reservation>>, PaginatedRequest>({
      query: (params) => ({
        url: '/reservations',
        params,
      }),
    }),
    updateReservation: builder.mutation<ApiResponse, [Reservation['id'], UpdateReservationRequest]>(
      {
        query: ([reservationId, body]) => ({
          url: `/reservations/${reservationId}`,
          method: 'PATCH',
          body,
        }),
      },
    ),
    getCustomerDetail: builder.query<ApiResponse<User>, User['id']>({
      query: (id) => ({
        url: `/customers/${id}`,
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
  useLogoutMutation,
  useResendVerificationEmailMutation,
  useRefreshTokenMutation,
  useDeleteAccountMutation,
  useCreateServiceMutation,
  useUpdateServiceMutation,
  useDeleteServiceMutation,
  useSearchCompaniesQuery,
  useGetCompanyDetailQuery,
  useLazyGetAviableHoursByDateQuery,
  useCreateReservationMutation,
  useGetReservationsQuery,
  useUpdateReservationMutation,
  useGetCustomerDetailQuery,
} = api;
