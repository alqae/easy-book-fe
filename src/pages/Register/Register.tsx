import React from 'react';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Link, useSearchParams } from 'react-router-dom';

import { useGetCountriesQuery, useLazyGetCitiesByCountryQuery } from '@/lib/api';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { register } from '@/store/slices/auth.slice';
import { Button } from '@/components/ui/button';
import { useAppDispatch } from '@/store/hooks';
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

const formSchema = Yup.object({
  firstName: Yup.string().required(),
  lastName: Yup.string().required(),
  city: Yup.string().required(),
  country: Yup.string().required(),
  phoneNumber: Yup.string().matches(
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/,
    'Phone number is not valid',
  ),
  email: Yup.string()
    .email()
    .when('token', {
      is: (token: string) => !!token,
      then: (schema) => schema.required(),
    }),
  password: Yup.string().min(6).required(),
  token: Yup.string().optional(),
  role: Yup.string().oneOf(Object.values(UserRole)).required(),
});

export const RegisterPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [wasInvited, setWasInvited] = React.useState(false);

  const [getCitiesByCountry, { data: cities = [] }] = useLazyGetCitiesByCountryQuery();
  const { data: countries = [] } = useGetCountriesQuery();

  const uniqueCities = React.useMemo(() => {
    const allCities = new Set<string>();
    cities.forEach((city) => allCities.add(city.name));
    return Array.from(allCities);
  }, [cities]);

  const dispatch = useAppDispatch();

  const form = useForm<Yup.InferType<typeof formSchema>>({
    defaultValues: {
      firstName: '',
      lastName: '',
      city: '',
      country: '',
      phoneNumber: '',
      email: '',
      password: '',
      token: '',
      role: UserRole.CUSTOMER,
    },
    resolver: yupResolver(formSchema),
  });

  const onSubmit = (data: Yup.InferType<typeof formSchema>) => dispatch(register(data));

  React.useEffect(() => {
    if (searchParams.get('token')) {
      setWasInvited(true);
      form.setValue('token', searchParams.get('token') as string);
      // TODO: validate token on load page to prevent token invalids after submit
    }

    return () => {
      setWasInvited(false);
      setSearchParams({});
    };
  }, [form, searchParams, setSearchParams]);

  return (
    <>
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          {wasInvited ? 'Complete your registration' : 'Create an account'}
        </h1>
        <p className="text-sm text-muted-foreground">
          {wasInvited
            ? 'Enter your details to complete your registration'
            : 'Enter your email below to create your account'}
        </p>
      </div>

      <Form {...form}>
        <form className="grid gap-6" onSubmit={form.handleSubmit(onSubmit)}>
          <ToggleGroup
            onValueChange={(value) => form.setValue('role', value as UserRole)}
            value={form.watch('role') as UserRole}
            className="w-full"
            variant="outline"
            type="single"
          >
            <ToggleGroupItem value={UserRole.CUSTOMER} className="flex-1">
              Customer
            </ToggleGroupItem>
            <ToggleGroupItem value={UserRole.BUSINESS} className="flex-1">
              Business
            </ToggleGroupItem>
          </ToggleGroup>

          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First name</FormLabel>
                <FormControl>
                  <Input {...field} />
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
                <FormLabel>Last name</FormLabel>
                <FormControl>
                  <Input {...field} />
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
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {!wasInvited && (
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
          )}

          <FormField
            control={form.control}
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
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country</FormLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    form.setValue('city', '');
                    getCitiesByCountry(value);
                  }}
                  defaultValue={field.value}
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
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={!cities.length}
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

          <Button type="submit">Register</Button>
        </form>
      </Form>

      <p className="px-8 text-center text-sm text-muted-foreground">
        By clicking register, you agree to our{' '}
        <Link to="/terms" className="underline underline-offset-4 hover:text-primary">
          Terms of Service
        </Link>{' '}
        and{' '}
        <Link to="/privacy" className="underline underline-offset-4 hover:text-primary">
          Privacy Policy
        </Link>
        .
      </p>
    </>
  );
};
