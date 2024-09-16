import { HiOutlineExclamationTriangle } from 'react-icons/hi2';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import React from 'react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { fetchProfile, selectUserLogged } from '@/store/slices/profile.slice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useUpdateRoleMutation } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { ApiResponse } from '@/types/requests';
import { UserRole } from '@/types/enums';

export const UpdateRole: React.FC = () => {
  const [updateRole, { isError, isSuccess, isLoading, error, data }] = useUpdateRoleMutation();

  const userLogged = useAppSelector(selectUserLogged);
  const dispatch = useAppDispatch();

  const nextStatus = userLogged?.role === UserRole.BUSINESS ? UserRole.CUSTOMER : UserRole.BUSINESS;

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-bold tracking-tight">
        Update my role to {nextStatus.toLowerCase()}
      </h3>

      <p className="text-muted-foreground text-sm">
        You are currently {userLogged?.role.toLowerCase()} and will be {nextStatus.toLowerCase()}
        after this action, you can change it anytime
      </p>

      {isError && (
        <Alert variant="destructive">
          <HiOutlineExclamationTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {((error as FetchBaseQueryError).data as ApiResponse).message}
          </AlertDescription>
        </Alert>
      )}

      {isSuccess && (
        <Alert variant="success">
          <HiOutlineExclamationTriangle className="h-4 w-4" />
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>{data?.message}</AlertDescription>
        </Alert>
      )}

      <Button
        onClick={() => updateRole(nextStatus).finally(() => dispatch(fetchProfile()))}
        disabled={isLoading}
      >
        Make me {nextStatus.toLowerCase()}
      </Button>
    </div>
  );
};
