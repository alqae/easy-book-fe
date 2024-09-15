import { ExclamationTriangleIcon } from '@radix-ui/react-icons';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import React from 'react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { selectUserLogged } from '@/store/slices/profile.slice';
import { useResendVerificationEmailMutation } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { useAppSelector } from '@/store/hooks';
import { ApiResponse } from '@/types/requests';
import { UserStatus } from '@/types/enums';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export const VerifyEmailModal: React.FC = () => {
  const [showVerifyModal, setShowVerifyModal] = React.useState(true);

  const [resendVerifyEmail, { isLoading, isError, error }] = useResendVerificationEmailMutation();

  const userLogged = useAppSelector(selectUserLogged);

  React.useEffect(() => {
    if (userLogged && userLogged.status === UserStatus.UNVERIFIED) {
      setShowVerifyModal(false);
    }
  }, [userLogged]);

  return (
    <Dialog open={showVerifyModal}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Verify your account</DialogTitle>
          <DialogDescription>
            Your account is not verified. Please verify your account.
          </DialogDescription>
        </DialogHeader>

        {isError && (
          <Alert variant="destructive">
            <ExclamationTriangleIcon className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {((error as FetchBaseQueryError).data as ApiResponse).message}
            </AlertDescription>
          </Alert>
        )}

        <DialogFooter>
          <Button disabled={isLoading} type="button" onClick={() => resendVerifyEmail()}>
            Resend email
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
