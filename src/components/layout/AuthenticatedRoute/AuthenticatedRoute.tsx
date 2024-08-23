import React from 'react';
import { Outlet, useNavigate } from 'react-router';

import { useAppSelector } from '@/store/hooks';
import { selectIsAuthenticated } from '@/store/slices/auth.slice';

export const AuthenticatedRoute: React.FC = () => {
  const navigate = useNavigate();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div>
      autenticado
      <Outlet />
    </div>
  );
};
