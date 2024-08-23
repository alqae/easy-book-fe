import React from 'react';
import { Link } from 'react-router-dom';
import { Outlet, useNavigate } from 'react-router';

import { useAppSelector } from '@/store/hooks';
import { selectIsAuthenticated } from '@/store/slices/auth.slice';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const year = new Date().getFullYear();

export const AuthenticatedRoute: React.FC = () => {
  const navigate = useNavigate();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex flex-col flex-nowrap">
      <header className="bg-white border-b p-4 flex justify-between items-center">
        <span>EasyBook</span>

        <div className="space-x-2">
          <Link to="/dashboard" className={cn(buttonVariants({ variant: 'link' }), 'underline')}>
            Need Help?
          </Link>

          <Button variant="default">Login</Button>
          <Button variant="secondary">Register</Button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>

      <footer className="z-20 w-full p-4 bg-white border-t border-gray-200 shadow md:flex md:items-center md:justify-between md:p-6">
        <span className="text-sm text-gray-500 sm:text-center">
          © {year}{' '}
          <a href="https://easybook.com/" className="hover:underline">
            EasyBook
          </a>
          . All Rights Reserved.
        </span>
        <ul className="flex flex-wrap items-center mt-3 text-sm font-medium text-gray-500 sm:mt-0">
          <Link to="/dashboard" className={cn(buttonVariants({ variant: 'link' }), 'underline')}>
            Need Help?
          </Link>

          <Link to="/dashboard" className={cn(buttonVariants({ variant: 'link' }), 'underline')}>
            About Us
          </Link>

          <Link to="/dashboard" className={cn(buttonVariants({ variant: 'link' }), 'underline')}>
            Privacy Policy
          </Link>

          <Link to="/dashboard" className={cn(buttonVariants({ variant: 'link' }), 'underline')}>
            Terms of Service
          </Link>
        </ul>
      </footer>
    </div>
  );
};
