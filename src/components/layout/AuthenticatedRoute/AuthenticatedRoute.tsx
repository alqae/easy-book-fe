import React from 'react';
import { Link } from 'react-router-dom';
import { FaUser } from 'react-icons/fa6';
import { GrPowerShutdown } from 'react-icons/gr';
import { Outlet, useNavigate } from 'react-router';

import { fetchProfile, selectUserLogged } from '@/store/slices/profile.slice';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { logOut, selectIsAuthenticated } from '@/store/slices/auth.slice';
import { VerifyEmailModal } from '@/components/modals/VerifyEmailModal';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { buttonVariants } from '@/components/ui/button';
import { UserStatus } from '@/types/enums';
import { cn, getURLByAttachment } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const year = new Date().getFullYear();

export const AuthenticatedRoute: React.FC = () => {
  const navigate = useNavigate();

  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const userLogged = useAppSelector(selectUserLogged);

  React.useEffect(() => {
    if (isAuthenticated && !userLogged) {
      dispatch(fetchProfile());
    } else if (!isAuthenticated) {
      navigate('/login');
    }

    if (isAuthenticated && userLogged) {
      switch (userLogged.status) {
        case UserStatus.BANNED:
        case UserStatus.DELETED:
        case UserStatus.INACTIVE:
          dispatch(logOut());
          navigate('/login');
          break;

        case UserStatus.ACTIVE:
        default:
          break;
      }
    }
  }, [isAuthenticated, userLogged, dispatch, navigate]);

  return (
    <>
      <VerifyEmailModal />

      <div className="min-h-screen max-h-screen flex flex-col flex-nowrap">
        <header className="bg-white border-b p-4">
          <div className="container flex justify-between items-center">
            <Link to="/">EasyBook</Link>

            <div className="flex items-center gap-2">
              <Link
                to="/dashboard"
                className={cn(buttonVariants({ variant: 'link' }), 'underline')}
              >
                Need Help?
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Avatar className="inline-block">
                    <AvatarImage src={getURLByAttachment(userLogged?.avatar)} alt="@shadcn" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    <FaUser />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => dispatch(logOut())}>
                    <GrPowerShutdown />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
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
    </>
  );
};
