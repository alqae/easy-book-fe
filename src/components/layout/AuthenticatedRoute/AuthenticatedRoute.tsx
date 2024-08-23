import React from 'react';
import { Outlet, useNavigate } from 'react-router';

export interface AuthenticatedRouteProps {}

export const AuthenticatedRoute: React.FC<AuthenticatedRouteProps> = () => {
  const navigate = useNavigate();
  const isAuthenticated = true;

  if (!isAuthenticated) {
    navigate('/login');
  }

  return (
    <div>
      <Outlet />
    </div>
  );
};
