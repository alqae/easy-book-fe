import React from 'react';
import { Routes, Route } from 'react-router-dom';

import './styles/globals.scss';

import { UnauthenticatedRoute } from '@/components/UnauthenticatedRoute';
import { AuthenticatedRoute } from '@/components/AuthenticatedRoute';
import {
  HomePage,
  SearchPage,
  ProfilePage,
  LoginPage,
  RegisterPage,
  ForgotPasswordPage,
  VerifyEmailPage,
  BusinessDetailPage,
  UnauthorizedPage,
  NotFoundPage,
} from '@/pages';

const Router: React.FC = () => (
  <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/search" element={<SearchPage />} />
    <Route path="/business/:id" element={<BusinessDetailPage />} />
    <Route path="/unauthorized" element={<UnauthorizedPage />} />

    <Route element={<UnauthenticatedRoute />}>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
    </Route>

    <Route element={<AuthenticatedRoute />}>
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/verify-email" element={<VerifyEmailPage />} />
    </Route>

    <Route path="/*" element={<NotFoundPage />} />
  </Routes>
);

const App = () => <Router />;

export default App;
