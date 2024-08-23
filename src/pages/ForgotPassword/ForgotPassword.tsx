import React from 'react';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const forgotPasswordFormSchema = Yup.object({
  email: Yup.string().email().required(),
});

const resetPasswordFormSchema = Yup.object({
  token: Yup.string().required(),
  password: Yup.string().min(6).required(),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required(),
});

export const ForgotPasswordPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [wasInvited, setWasInvited] = React.useState(false);

  const resetPasswordForm = useForm<Yup.InferType<typeof resetPasswordFormSchema>>({
    defaultValues: {
      token: '',
      password: '',
      confirmPassword: '',
    },
    resolver: yupResolver(resetPasswordFormSchema),
  });

  const forgotPasswordForm = useForm<Yup.InferType<typeof forgotPasswordFormSchema>>({
    defaultValues: {
      email: '',
    },
    resolver: yupResolver(forgotPasswordFormSchema),
  });

  const onSubmitForgotPassword = (data: Yup.InferType<typeof forgotPasswordFormSchema>) => {
    console.log(data);
  };

  const onSubmitResetPassword = (data: Yup.InferType<typeof resetPasswordFormSchema>) => {
    console.log(data);
  };

  React.useEffect(() => {
    if (searchParams.get('token')) {
      setWasInvited(true);
      resetPasswordForm.setValue('token', searchParams.get('token') as string);
      // TODO: validate token on load page to prevent token invalids after submit
    }

    return () => {
      setWasInvited(false);
      setSearchParams({});
    };
  }, [resetPasswordForm, searchParams, setSearchParams]);

  return (
    <>
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          {wasInvited ? 'Reset Password' : 'Forgot Password'}
        </h1>
        <p className="text-sm text-muted-foreground">
          {wasInvited
            ? "Don't worry, we'll send you an email to reset your password"
            : 'Now you can reset your password'}
        </p>
      </div>

      {wasInvited ? (
        <Form {...resetPasswordForm}>
          <form
            className="grid gap-6"
            onSubmit={resetPasswordForm.handleSubmit(onSubmitResetPassword)}
          >
            <FormField
              control={resetPasswordForm.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={resetPasswordForm.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit">Reset Password</Button>
          </form>
        </Form>
      ) : (
        <Form {...forgotPasswordForm}>
          <form
            className="grid gap-6"
            onSubmit={forgotPasswordForm.handleSubmit(onSubmitForgotPassword)}
          >
            <FormField
              control={forgotPasswordForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit">Send Link</Button>
          </form>
        </Form>
      )}
    </>
  );
};
