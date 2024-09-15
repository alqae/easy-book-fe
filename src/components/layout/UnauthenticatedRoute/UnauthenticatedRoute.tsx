import React from 'react';
import { Outlet, useNavigate } from 'react-router';

import { selectIsAuthenticated } from '@/store/slices/auth.slice';
import { useAppSelector } from '@/store/hooks';

export const UnauthenticatedRoute: React.FC = () => {
  const navigate = useNavigate();

  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="lg:p-8 mx-auto h-full overflow-hidden flex items-center justify-center">
      <Outlet />
    </div>
  );
};
