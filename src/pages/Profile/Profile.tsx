import React from 'react';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';

import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useGetCountriesQuery, useLazyGetCitiesByCountryQuery } from '@/lib/api';

export const ProfilePage: React.FC = () => {
  const [getCitiesByCountry, { data: cities = [] }] = useLazyGetCitiesByCountryQuery();
  const { data: countries = [] } = useGetCountriesQuery();

  const uniqueCities = React.useMemo(() => {
    const allCities = new Set<string>();
    cities.forEach((city) => allCities.add(city.name));
    return Array.from(allCities);
  }, [cities]);

  const formSchema = Yup.object().shape({
    firstName: Yup.string().required(),
    lastName: Yup.string().required(),
    email: Yup.string().email().required(),
    phoneNumber: Yup.string().optional(),
    description: Yup.string().optional(),
    city: Yup.string().optional(),
    country: Yup.string().optional(),
    address: Yup.string().optional(),
  });

  const form = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      description: '',
      address: '',
    },
    resolver: yupResolver(formSchema),
  });

  const onSubmit = (data: Yup.InferType<typeof formSchema>) => {
    console.log(data);
  };

  return (
    <div className="space-y-6 p-10 pb-16 container">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">Manage your account settings and privacy</p>
      </div>

      <Separator className="my-6" />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="gap-4 grid grid-cols-2">
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

          <Button type="submit" className="col-span-2">
            Update account
          </Button>
        </form>
      </Form>
    </div>
  );
};
