import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import ReactPaginate from 'react-paginate';
import React from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDate, getInitials, getURLByAttachment } from '@/lib/utils';
import { selectUserLogged } from '@/store/slices/profile.slice';
import { useGetReservationsQuery } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { useAppSelector } from '@/store/hooks';
import { UserRole } from '@/types/enums';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Pagination,
  PaginationEllipsis,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

export const ReservationsPage: React.FC = () => {
  const userLogged = useAppSelector(selectUserLogged);
  const isBusiness = userLogged?.role === UserRole.BUSINESS;
  const isCustomer = userLogged?.role === UserRole.CUSTOMER;

  const [currentPage, setCurrentPage] = React.useState(0);
  const itemsPerPage = 10;

  const onPageChange = ({ selected }: { selected: number }) => setCurrentPage(selected);

  const { data: results, isLoading } = useGetReservationsQuery(
    {
      limit: itemsPerPage,
      offset: currentPage * itemsPerPage,
    },
    {
      refetchOnMountOrArgChange: true,
    },
  );

  const { items: reservations = [], count } = results?.data ?? {
    count: 0,
    items: [],
  };

  const pageCount = React.useMemo(() => Math.ceil(count / itemsPerPage), [count, itemsPerPage]);

  return (
    <div className="container py-6 space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Reservations ({reservations.length})</h2>

      {isLoading && <p>Loading...</p>}

      <Table>
        <TableCaption>A list of your reservations.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Service</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>{isBusiness ? 'Customer' : 'Company'}</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {reservations.map((reservation) => (
            <TableRow key={reservation.id}>
              <TableCell>{reservation.service.name}</TableCell>
              <TableCell>{reservation.status}</TableCell>
              <TableCell>{formatDate(reservation.startTime)}</TableCell>
              <TableCell>{reservation.service.duration}</TableCell>
              <TableCell className="flex gap-2 items-center">
                {isBusiness ? (
                  <>
                    <Avatar>
                      <AvatarImage src={getURLByAttachment(reservation.business.avatar)} />
                      <AvatarFallback>
                        {getInitials(reservation.business.firstName, reservation.business.lastName)}
                      </AvatarFallback>
                    </Avatar>

                    <div>{`${reservation.customer.firstName} ${reservation.customer.lastName}`}</div>
                  </>
                ) : (
                  <>
                    <Avatar>
                      <AvatarImage src={getURLByAttachment(reservation.customer.avatar)} />
                      <AvatarFallback>
                        {getInitials(reservation.customer.firstName, reservation.customer.lastName)}
                      </AvatarFallback>
                    </Avatar>

                    <div>{`${reservation.customer.firstName} ${reservation.customer.lastName}`}</div>
                  </>
                )}
              </TableCell>
              <TableCell>$&nbsp;{reservation.service.price}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <DotsHorizontalIcon className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>

                    {isBusiness && <DropdownMenuItem>View customer</DropdownMenuItem>}
                    {isCustomer && <DropdownMenuItem>View company</DropdownMenuItem>}
                    <DropdownMenuSeparator />

                    <DropdownMenuItem>Cancel</DropdownMenuItem>

                    {isCustomer && <DropdownMenuItem>Reschedule</DropdownMenuItem>}
                    {isBusiness && (
                      <>
                        <DropdownMenuItem>The customer didn&apos;t show up</DropdownMenuItem>
                        <DropdownMenuItem>Confirm</DropdownMenuItem>
                        <DropdownMenuItem>Complete</DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {pageCount > 1 && (
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
      )}
    </div>
  );
};
