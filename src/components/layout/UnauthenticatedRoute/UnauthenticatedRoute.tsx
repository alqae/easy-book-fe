import React from 'react';
import { Link } from 'react-router-dom';
import { Outlet, useNavigate } from 'react-router';

import { selectIsAuthenticated } from '@/store/slices/auth.slice';
import { buttonVariants } from '@/components/ui/button';
import { useAppSelector } from '@/store/hooks';
import { cn } from '@/lib/utils';

export const UnauthenticatedRoute: React.FC = () => {
  const navigate = useNavigate();

  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="container relative h-full flex-col items-center justify-center md:grid">
      <Link
        to="/login"
        className={cn(
          buttonVariants({ variant: 'ghost' }),
          'absolute right-4 top-4 md:right-8 md:top-8',
        )}
      >
        Login
      </Link>

      <Link
        to="/register"
        className={cn(
          buttonVariants({ variant: 'ghost' }),
          'absolute right-4 top-8 md:right-8 md:top-16',
        )}
      >
        Register
      </Link>

      <Link
        to="/forgot-password"
        className={cn(
          buttonVariants({ variant: 'ghost' }),
          'absolute right-4 top-12 md:right-8 md:top-24',
        )}
      >
        Forgot Password
      </Link>

      <div className="lg:p-8 mx-auto">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
