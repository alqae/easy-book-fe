import * as Yup from 'yup';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { HiOutlineExclamationTriangle } from 'react-icons/hi2';

import { fetchProfile, selectUserLogged } from '@/store/slices/profile.slice';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { Textarea } from '@/components/ui/textarea';
import { AvatarPicker } from '../ui/avatar-picker';
import { Button } from '@/components/ui/button';
import { ApiResponse } from '@/types/requests';
import { Input } from '@/components/ui/input';
import { UserRole } from '@/types/enums';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  useGetCountriesQuery,
  useLazyGetCitiesByCountryQuery,
  useUpdateProfileMutation,
} from '@/lib/api';

export const UpdateProfileForm: React.FC = () => {
  const [getCitiesByCountry, { data: cities = [] }] = useLazyGetCitiesByCountryQuery();
  const [updateProfile, { isError, isSuccess, error, data: response }] = useUpdateProfileMutation();
  const { data: countries = [] } = useGetCountriesQuery();

  const userLogged = useAppSelector(selectUserLogged);
  const dispatch = useAppDispatch();

  const uniqueCities = React.useMemo(() => {
    const allCities = new Set<string>();
    cities.forEach((city) => allCities.add(city.name));
    return Array.from(allCities);
  }, [cities]);

  const formSchema = Yup.object().shape({
    firstName: Yup.string().required(),
    lastName: Yup.string().required(),
    email: Yup.string().email().required(),
    phoneNumber: Yup.string().required(),
    description: Yup.string().optional(),
    city: Yup.string().required(),
    country: Yup.string().required(),
    address: Yup.string().required(),
  });

  const form = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      description: '',
      address: '',
      city: '',
      country: '',
    },
    resolver: yupResolver(formSchema),
  });

  useEffect(() => {
    if (userLogged) {
      form.setValue('firstName', userLogged.firstName);
      form.setValue('lastName', userLogged.lastName);
      form.setValue('email', userLogged.email);
      form.setValue('phoneNumber', userLogged.phoneNumber);
      form.setValue('description', userLogged.description);
      form.setValue('address', userLogged.address);

      if (userLogged.country && !!countries.length) {
        form.setValue('country', userLogged.country);
        getCitiesByCountry(userLogged.country).then(() => form.setValue('city', userLogged.city));
      }
    }
  }, [userLogged, countries, getCitiesByCountry, form]);

  const onSubmit = async (data: Yup.InferType<typeof formSchema>) => {
    try {
      await updateProfile({
        address: data.address,
        city: data.city,
        country: data.country,
        description: data.description,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: data.phoneNumber,
      });
    } finally {
      dispatch(fetchProfile());
    }
  };

  return (
    <Form {...form}>
      <h3 className="text-lg font-bold tracking-tight">Update Profile</h3>

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
          <AlertDescription>{response?.message}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={form.handleSubmit(onSubmit)} className="gap-4 grid grid-cols-2">
        <div className="col-span-2 grid grid-cols-12">
          <div className="col-span-12 md:col-span-3 p-6">
            <AvatarPicker value={userLogged?.avatar} onChange={() => dispatch(fetchProfile())} />
          </div>

          <div className="col-span-12 md:col-span-9 grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input placeholder="+1 (555) 123-4567" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="example@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <Select
                    disabled={!countries.length}
                    onValueChange={(value) => {
                      field.onChange(value);
                      form.setValue('city', '');
                      getCitiesByCountry(value);
                    }}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a country" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem key={country.country} value={country.country}>
                          {country.country}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="city"
              defaultValue={userLogged?.city}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    disabled={!cities.length}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a city" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {uniqueCities.map((city) => (
                        <SelectItem key={city} value={city}>
                          {city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input placeholder="p sherman calle wallaby 42, sydney maps" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {userLogged?.role === UserRole.BUSINESS && (
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Lorem ipsum dolor sit..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <Button type="submit" className="col-span-2">
          Update account
        </Button>
      </form>
    </Form>
  );
};
