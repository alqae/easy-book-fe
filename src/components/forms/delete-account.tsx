import { HiOutlineExclamationTriangle } from 'react-icons/hi2';
import React from 'react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useDeleteAccountMutation } from '@/lib/api';
import { logOut } from '@/store/slices/auth.slice';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { useAppDispatch } from '@/store/hooks';

export const DeleteAccountForm: React.FC = () => {
  const [deleteAccount, { isError }] = useDeleteAccountMutation();

  const dispatch = useAppDispatch();

  const onDeleteAccount = async () => {
    try {
      const result = await deleteAccount();

      if ('error' in result) {
        return;
      }

      toast({ variant: 'success', title: result.data.message });
    } finally {
      dispatch(logOut());
    }
  };

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-bold tracking-tight">Delete you account</h3>

      <p className="text-muted-foreground text-sm">
        This will delete your account. This action cannot be undone.
      </p>

      {isError && (
        <Alert variant="destructive">
          <HiOutlineExclamationTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Something went wrong while trying to delete you account.
          </AlertDescription>
        </Alert>
      )}

      <Button variant="destructive" onClick={onDeleteAccount}>
        Delete my account
      </Button>
    </div>
  );
};
