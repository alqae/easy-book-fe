import React from 'react';
import { Routes, Route } from 'react-router-dom';

import './styles/globals.scss';

import { UnauthenticatedRoute } from '@/components/layout/UnauthenticatedRoute';
import { AuthenticatedRoute } from '@/components/layout/AuthenticatedRoute';
import {
  HomePage,
  SearchPage,
  ProfilePage,
  LoginPage,
  RegisterPage,
  ForgotPasswordPage,
  CompanyDetailPage,
  UnauthorizedPage,
  NotFoundPage,
  ReservationsPage,
} from '@/pages';

const Router: React.FC = () => (
  <Routes>
    {/* Public routes */}

    {/* Unauthenticated routes */}
    <Route element={<UnauthenticatedRoute />}>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
    </Route>

    {/* Authenticated routes */}
    <Route element={<AuthenticatedRoute />}>
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/" element={<HomePage />} />
      <Route path="/company/:id" element={<CompanyDetailPage />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/reservations" element={<ReservationsPage />} />
    </Route>

    {/* Status pages */}
    <Route path="/unauthorized" element={<UnauthorizedPage />} />
    <Route path="/*" element={<NotFoundPage />} />
  </Routes>
);

const App = () => <Router />;

export default App;
