import React from 'react';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useAppDispatch } from '@/store/hooks';
import { logIn } from '@/store/slices/auth.slice';

const formSchema = Yup.object({
  email: Yup.string().email().required(),
  password: Yup.string().required(),
});

export const LoginPage: React.FC = () => {
  const dispatch = useAppDispatch();

  const form = useForm<Yup.InferType<typeof formSchema>>({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: yupResolver(formSchema),
  });

  const onSubmit = (data: Yup.InferType<typeof formSchema>) => dispatch(logIn(data));

  return (
    <Card className="max-w-sm">
      <CardHeader>
        <CardTitle className="text-xl">Welcome back</CardTitle>
        <CardDescription>Enter your credentials to access your account</CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
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

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormDescription>
                    Use at least one letter, one numeral, and seven characters.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit">Login</Button>
          </form>
        </Form>

        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account?&nbsp;
          <a href="/register" rel="noreferrer" className={buttonVariants({ variant: 'link' })}>
            Sign up
          </a>
        </div>

        <div className="mt-4 text-center text-sm">
          <a
            href="/forgot-password"
            rel="noreferrer"
            className={buttonVariants({ variant: 'link' })}
          >
            Forgot your password?
          </a>
        </div>
      </CardContent>
    </Card>
  );
};
