import React from 'react';
import ReactPaginate from 'react-paginate';
import { useSearchParams } from 'react-router-dom';

import { useGetCountriesQuery, useSearchCompaniesQuery } from '@/lib/api';
import { CompanyCard } from '@/components/ui/company-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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

export const SearchPage: React.FC = () => {
  const { data: countries, isLoading: isLoadingCountries, isError } = useGetCountriesQuery();

  const [searchParams, setSearchParams] = useSearchParams();

  // Search
  const textSearch = searchParams.get('text') ?? undefined;
  const selectedCountry = searchParams.get('country') ?? undefined;

  // Pagination
  const [currentPage, setCurrentPage] = React.useState(0);
  const itemsPerPage = 10;

  const onPageChange = ({ selected }: { selected: number }) => setCurrentPage(selected);

  const { data: results, isLoading: isLoadingResults } = useSearchCompaniesQuery(
    {
      country: selectedCountry,
      text: textSearch,
      limit: itemsPerPage,
      offset: currentPage * itemsPerPage,
    },
    {
      refetchOnMountOrArgChange: true,
    },
  );

  const { items: companies = [], count } = results?.data ?? {
    count: 0,
    items: [],
  };

  const pageCount = React.useMemo(() => Math.ceil(count / itemsPerPage), [count, itemsPerPage]);

  return (
    <>
      <div className="border-b py-5 mb-5">
        <div className="grid grid-cols-12 items-center gap-4 container">
          <div className="col-span-7">
            <Input
              type="search"
              placeholder="Search for..."
              value={textSearch}
              onChange={(e) => {
                setSearchParams({ text: e.target.value });
                setCurrentPage(0);
              }}
            />
          </div>

          <div className="col-span-4">
            <Select
              value={selectedCountry}
              disabled={isLoadingCountries || isError}
              onValueChange={(country) => {
                setSearchParams({ country });
                setCurrentPage(0);
              }}
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
        {Boolean(textSearch?.length) && (
          <span className="block mb-5">
            Results for &quot;<b>{textSearch}&quot;</b>
            {selectedCountry && (
              <>
                &nbsp; in <b>{selectedCountry}</b>
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
    </>
  );
};
