import React from 'react';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { forgotPassword, resetPassword, selectIsLoading } from '@/store/slices/auth.slice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { Button, buttonVariants } from '@/components/ui/button';
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
  password: Yup.string().required().min(6),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required(),
});

export const ForgotPasswordPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isRestoringPassword, setIsRestoringPassword] = React.useState(false);

  const isLoading = useAppSelector(selectIsLoading);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

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

  const onSubmitForgotPassword = (data: Yup.InferType<typeof forgotPasswordFormSchema>) =>
    dispatch(forgotPassword(data));

  const onSubmitResetPassword = (data: Yup.InferType<typeof resetPasswordFormSchema>) =>
    dispatch(resetPassword(data)).then(() => navigate('/login'));

  React.useEffect(() => {
    if (searchParams.get('token')) {
      setIsRestoringPassword(true);
      resetPasswordForm.setValue('token', searchParams.get('token') as string);
      // TODO: validate token on load page to prevent token invalids after submit
    }

    return () => {
      setIsRestoringPassword(false);
      setSearchParams({});
    };
  }, [resetPasswordForm, searchParams, setSearchParams]);

  return (
    <Card className="max-w-sm w-full">
      <CardHeader>
        <CardTitle className="text-xl">
          {isRestoringPassword ? 'Reset Password' : 'Forgot Password'}
        </CardTitle>
        <CardDescription>
          {isRestoringPassword
            ? "Don't worry, we'll send you an email to reset your password"
            : 'Now you can reset your password'}
        </CardDescription>
      </CardHeader>

      <CardContent>
        {isRestoringPassword ? (
          <Form {...resetPasswordForm}>
            <form
              className="grid gap-4"
              onSubmit={resetPasswordForm.handleSubmit(onSubmitResetPassword)}
            >
              <FormField
                control={resetPasswordForm.control}
                name="password"
                render={() => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        autoComplete="off"
                        {...resetPasswordForm.register('password')}
                      />
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
                      <Input type="password" autoComplete="off" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={isLoading}>
                Reset Password
              </Button>
            </form>
          </Form>
        ) : (
          <Form {...forgotPasswordForm}>
            <form
              className="grid gap-4"
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

              <Button type="submit" disabled={isLoading}>
                Send Link
              </Button>
            </form>
          </Form>
        )}

        <div className="mt-4 text-center text-sm">
          <a href="/login" rel="noreferrer" className={buttonVariants({ variant: 'link' })}>
            Back to Login
          </a>
        </div>
      </CardContent>
    </Card>
  );
};
