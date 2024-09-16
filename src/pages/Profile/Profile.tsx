import React from 'react';

import { UpdatePasswordForm } from '@/components/forms/update-password';
import { UpdateProfileForm } from '@/components/forms/update-profile';
import { DeleteAccountForm } from '@/components/forms/delete-account';
import { ManageServices } from '@/components/forms/manage-services';
import { selectUserLogged } from '@/store/slices/profile.slice';
import { UpdateRole } from '@/components/forms/update-role';
import { Separator } from '@/components/ui/separator';
import { useAppSelector } from '@/store/hooks';
import { UserRole } from '@/types/enums';

export const ProfilePage: React.FC = () => {
  const userLogged = useAppSelector(selectUserLogged);

  return (
    <div className="space-y-6 p-10 pb-16 container">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">Manage your account settings and privacy</p>
      </div>

      <Separator className="my-6" />
      <UpdateProfileForm />
      <Separator className="my-6" />
      {userLogged?.role === UserRole.BUSINESS && (
        <>
          <ManageServices />
          <Separator className="my-6" />
        </>
      )}
      <UpdatePasswordForm />
      <Separator className="my-6" />
      <DeleteAccountForm />
      <Separator className="my-6" />
      <UpdateRole />
    </div>
  );
};
