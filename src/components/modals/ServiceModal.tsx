import { HiOutlineExclamationTriangle } from 'react-icons/hi2';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import React from 'react';

import { useCreateServiceMutation, useUpdateServiceMutation } from '@/lib/api';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { fetchProfile } from '@/store/slices/profile.slice';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useAppDispatch } from '@/store/hooks';
import { ApiResponse } from '@/types/requests';
import { Input } from '@/components/ui/input';
import { Service } from '@/types/models';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from '../ui/use-toast';

export interface ServiceModalProps {
  // eslint-disable-next-line react/require-default-props
  defaultValue?: Service;
  show: boolean;
  onClose: () => void;
}

const formSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  description: Yup.string().required('Description is required'),
  duration: Yup.string().required('Duration is required'),
  price: Yup.number().required('Price is required').min(0),
});

export const ServiceModal: React.FC<ServiceModalProps> = ({ show, onClose, defaultValue }) => {
  const [createService, { isLoading: isCreating, error: errorCreating, isError: isErrorCreating }] =
    useCreateServiceMutation();
  const [updateService, { isLoading: isUpdating, error: errorUpdating, isError: isErrorUpating }] =
    useUpdateServiceMutation();

  const dispatch = useAppDispatch();

  const form = useForm({
    defaultValues: {
      name: '',
      description: '',
      duration: '',
      price: 0,
    },
    resolver: yupResolver(formSchema),
  });

  const onSubmit = async (data: Yup.InferType<typeof formSchema>) => {
    const action: Promise<ApiResponse> = defaultValue
      ? updateService([defaultValue.id, data]).unwrap()
      : createService(data).unwrap();

    await action
      .then((response) => {
        if ('data' in response) {
          toast({ variant: 'success', title: response.message });
          onClose();
        }
      })
      .finally(() => dispatch(fetchProfile()));
  };

  React.useEffect(() => {
    if (defaultValue) {
      form.setValue('name', defaultValue.name);
      form.setValue('description', defaultValue.description);
      form.setValue('duration', defaultValue.duration);
      form.setValue('price', defaultValue.price);
    }
  }, [defaultValue, form]);

  React.useEffect(() => {
    if (!show) {
      form.reset();
    }
  }, [show, form]);

  return (
    <Dialog open={show} onOpenChange={(x) => !x && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{defaultValue ? 'Update' : 'Create'} service</DialogTitle>
          <DialogDescription>
            {defaultValue
              ? 'Here you can update your service.'
              : 'Here you can create a new service.'}
          </DialogDescription>
        </DialogHeader>

        {(isErrorCreating || isErrorUpating) && (
          <Alert variant="destructive">
            <HiOutlineExclamationTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {
                (((errorCreating || errorUpdating) as FetchBaseQueryError).data as ApiResponse)
                  .message
              }
            </AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Computer repair..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Lorem ipsum..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duration</FormLabel>
                  <FormControl>
                    <Input placeholder="1h 30m, 2h 30m, 3h..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isCreating || isUpdating}>
              Save
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
