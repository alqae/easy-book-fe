import React from 'react';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import ReactPaginate from 'react-paginate';
import { yupResolver } from '@hookform/resolvers/yup';

import { useGetCountriesQuery, useSearchCompaniesQuery } from '@/lib/api';
import { CompanyCard } from '@/components/ui/company-card';
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
import {
  Pagination,
  PaginationEllipsis,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

const formSchema = Yup.object().shape({
  country: Yup.string().optional(),
  city: Yup.string().required(),
  text: Yup.string().required(),
});

export const SearchPage: React.FC = () => {
  const { data: countries, isLoading: isLoadingCountries, isError } = useGetCountriesQuery();

  const form = useForm({
    defaultValues: {
      country: '',
      city: '',
      text: '',
    },
    resolver: yupResolver(formSchema),
  });

  // Search
  const textSearch = form.watch('text');
  const selectedCity = form.watch('city');
  const selectedCountry = form.watch('country');

  // Pagination
  const [currentPage, setCurrentPage] = React.useState(0);
  const itemsPerPage = 10;

  const onPageChange = ({ selected }: { selected: number }) => setCurrentPage(selected);

  const { data: results, isLoading: isLoadingResults } = useSearchCompaniesQuery(
    {
      // 'text', 'country' and 'city' are used for filtering
      city: selectedCity,
      country: selectedCountry,
      text: textSearch,
      // 'limit' and 'offset' are used for pagination
      limit: itemsPerPage,
      offset: currentPage * itemsPerPage,
    },
    {
      refetchOnMountOrArgChange: true,
    },
  );

  const { data: companies = [] } = results || { data: [] };

  const pageCount = React.useMemo(
    () => Math.ceil(companies.length / itemsPerPage),
    [companies.length],
  );

  return (
    <Form {...form}>
      <div className="border-b py-5 mb-5">
        <div className="grid grid-cols-12 items-center gap-4 container">
          <div className="col-span-7">
            <Input type="search" placeholder="Search for..." {...form.register('text')} />
          </div>

          <div className="col-span-4">
            <Select
              disabled={isLoadingCountries || isError}
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
        {Boolean(textSearch.length) && (
          <span className="block mb-5">
            Results for &quot;<b>{textSearch}&quot;</b>
            {selectedCountry && (
              <>
                &nbsp;in <b>{selectedCountry}</b>
              </>
            )}
          </span>
        )}

        <div className="space-y-3">
          {isLoadingResults && <span>Loading...</span>}

          {isError && <span>An error occurred</span>}

          {!companies.length && <span>No results found</span>}

          {companies.map((company) => (
            <CompanyCard key={company.id} {...company} />
          ))}

          <Pagination>
            <ReactPaginate
              previousLabel={<PaginationPrevious />}
              nextLabel={<PaginationNext />}
              breakLabel={<PaginationEllipsis />}
              pageCount={pageCount}
              onPageChange={onPageChange}
              forcePage={currentPage}
              pageRangeDisplayed={itemsPerPage}
              marginPagesDisplayed={1}
              renderOnZeroPageCount={null}
              containerClassName="pagination flex items-center justify-center gap-1"
              pageLinkClassName="pagination-link"
              activeLinkClassName="active underline underline-offset-4"
              breakLinkClassName="pagination-ellipsis"
            />
          </Pagination>
        </div>
      </div>
    </Form>
  );
};
