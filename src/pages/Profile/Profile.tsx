import React from 'react';

import { UpdatePasswordForm } from '@/components/forms/update-password';
import { UpdateProfileForm } from '@/components/forms/update-profile';
import { DeleteAccountForm } from '@/components/forms/delete-account';
import { Separator } from '@/components/ui/separator';

export const ProfilePage: React.FC = () => (
  <div className="space-y-6 p-10 pb-16 container">
    <div className="space-y-0.5">
      <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
      <p className="text-muted-foreground">Manage your account settings and privacy</p>
    </div>

    <Separator className="my-6" />
    <UpdateProfileForm />
    <Separator className="my-6" />
    <UpdatePasswordForm />
    <Separator className="my-6" />
    <DeleteAccountForm />
  </div>
);
