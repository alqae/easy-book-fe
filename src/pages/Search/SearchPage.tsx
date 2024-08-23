import React from 'react';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { BusinessCard } from '@/components/ui/business-card';
import { useGetCountriesQuery } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form } from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export const SearchPage: React.FC = () => {
  const { data: countries, isLoading, isError } = useGetCountriesQuery();

  const formSchema = Yup.object().shape({
    country: Yup.string().optional(),
    query: Yup.string().required(),
  });

  const form = useForm({
    defaultValues: {
      country: undefined,
      query: '',
    },
    resolver: yupResolver(formSchema),
  });

  const query = form.watch('query');
  const selectedCountry = form.watch('country');

  return (
    <Form {...form}>
      <div className="border-b py-5 mb-5">
        <div className="grid grid-cols-12 items-center gap-4 container">
          <div className="col-span-7">
            <Input type="search" placeholder="Search for..." {...form.register('query')} />
          </div>

          <div className="col-span-4">
            <Select
              disabled={isLoading || isError}
              onValueChange={(value) => form.setValue('country', value)}
              value={form.watch('country')}
            >
              <SelectTrigger className="w-full h-full">
                <SelectValue placeholder="Select an country" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Country</SelectLabel>
                  {countries?.map((country) => (
                    <SelectItem key={country.country} value={country.country}>
                      {country.country}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="col-span-1">
            Search
          </Button>
        </div>
      </div>

      <div className="container">
        {Boolean(query.length) && (
          <span className="block mb-5">
            Results for &quot;<b>{query}&quot;</b>
            {selectedCountry && (
              <>
                &nbsp;in <b>{selectedCountry}</b>
              </>
            )}
          </span>
        )}

        <div className="space-y-4">
          <BusinessCard
            fullName="Pretty Gal Lashes"
            address="Cra. 50A #24 - 51, La Florida, Itagüi, Antioquia"
            favs={35433}
            services={[
              'Haircut/color Consultation/NO ',
              "Men's Haircut",
              "Women's Haircut",
              'Shampoo & blow dry',
              'Men’s Clean up/ Fringe trim',
              'Partial Highlights',
              'Full Highlights',
              'Partial Highlights & haircut',
              'Balayage Full/ lived in blonding hair color a ',
              'Balayage retouch',
              'Balayage retouch & haircut',
              'Foilayge',
              'Face framing/money piece add o…',
              'Toner ‘add on’',
              'Full Tint',
              'Tint Retouch',
              'Tint & haircut',
              'Keratin Smoothing treatment',
              'OLAPLEX /Oribe Lux Treatment and Hair Mask',
              'Specialty Styling',
              'Perm/body waves',
            ]}
            imageUrl="https://github.com/shadcn.png"
          />
        </div>
      </div>
    </Form>
  );
};
