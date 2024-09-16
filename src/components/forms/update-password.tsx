import { HiOutlineExclamationTriangle } from 'react-icons/hi2';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import React from 'react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useUpdatePasswordMutation } from '@/lib/api';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const formSchema = Yup.object().shape({
  oldPassword: Yup.string().required(),
  newPassword: Yup.string().required(),
});

export const UpdatePasswordForm: React.FC = () => {
  const [updatePassword, { isError, isSuccess, isLoading, data: response }] =
    useUpdatePasswordMutation();

  const form = useForm({
    defaultValues: {
      oldPassword: '',
      newPassword: '',
    },
    resolver: yupResolver(formSchema),
  });

  const onSubmit = async (data: Yup.InferType<typeof formSchema>) => {
    try {
      await updatePassword(data);
    } finally {
      form.reset();
    }
  };

  return (
    <Form {...form}>
      <h3 className="text-lg font-bold tracking-tight">Update password</h3>

      {isError && (
        <Alert variant="destructive">
          <HiOutlineExclamationTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Something went wrong while trying to update your password
          </AlertDescription>
        </Alert>
      )}

      {isSuccess && (
        <Alert variant="success">
          <HiOutlineExclamationTriangle className="h-4 w-4" />
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>{response?.message}</AlertDescription>
        </Alert>
      )}

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <FormField
          control={form.control}
          name="oldPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Current Password</FormLabel>
              <FormControl>
                <Input type="password" autoComplete="off" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input type="password" autoComplete="off" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading} className="md:col-span-2">
          Reset Password
        </Button>
      </form>
    </Form>
  );
};
