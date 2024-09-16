import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import ReactPaginate from 'react-paginate';
import { useNavigate } from 'react-router';
import React from 'react';

import { useGetReservationsQuery, useUpdateReservationMutation } from '@/lib/api';
import { ChoseDateAndTimeModal } from '@/components/modals/ChoseDateAndTime';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDate, getInitials, getURLByAttachment } from '@/lib/utils';
import { selectUserLogged } from '@/store/slices/profile.slice';
import { ReservationStatus, UserRole } from '@/types/enums';
import { Badge, BadgeProps } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { useAppSelector } from '@/store/hooks';
import { Reservation } from '@/types/models';
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
  // DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Pagination,
  PaginationEllipsis,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

export const ReservationsPage: React.FC = () => {
  const navigate = useNavigate();

  const [reservationToReschedule, setReservationToReschedule] = React.useState<Reservation>();

  const [updateReservation, { isLoading: isLoadingStatus }] = useUpdateReservationMutation();

  const userLogged = useAppSelector(selectUserLogged);
  const isBusiness = userLogged?.role === UserRole.BUSINESS;
  const isCustomer = userLogged?.role === UserRole.CUSTOMER;

  const [currentPage, setCurrentPage] = React.useState(0);
  const itemsPerPage = 10;

  const onPageChange = ({ selected }: { selected: number }) => setCurrentPage(selected);

  const {
    data: results,
    isLoading: isLoadingReservations,
    refetch,
  } = useGetReservationsQuery(
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

  const onUpdateStatus = async (reservationId: Reservation['id'], status: ReservationStatus) => {
    try {
      const result = await updateReservation([reservationId, { status }]);

      if ('error' in result) {
        return;
      }

      toast({ variant: 'success', title: result.data.message });
    } finally {
      refetch();
    }
  };

  const getVariantByStatus = (status: ReservationStatus): BadgeProps['variant'] => {
    switch (status) {
      case ReservationStatus.CANCELED:
        return 'destructive';
      case ReservationStatus.COMPLETED:
      case ReservationStatus.CONFIRMED:
        return 'success';

      case ReservationStatus.PENDING:
      case ReservationStatus.IN_PROCESS:
        return 'warning';

      case ReservationStatus.NO_SHOW:
      case ReservationStatus.RESCHEDULED:
        return 'outline';

      default:
        return 'default';
    }
  };

  return (
    <>
      <div className="container py-6 space-y-6">
        <h2 className="text-3xl font-bold tracking-tight">Reservations ({reservations.length})</h2>

        {isLoadingReservations && <p>Loading...</p>}

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
                <TableCell>
                  <Badge variant={getVariantByStatus(reservation.status)}>
                    {reservation.status}
                  </Badge>
                </TableCell>
                <TableCell>{formatDate(reservation.startTime)}</TableCell>
                <TableCell>{reservation.service.duration}</TableCell>
                <TableCell className="flex gap-2 items-center">
                  {isBusiness ? (
                    <>
                      <Avatar>
                        <AvatarImage src={getURLByAttachment(reservation.business.avatar)} />
                        <AvatarFallback>
                          {getInitials(
                            reservation.business.firstName,
                            reservation.business.lastName,
                          )}
                        </AvatarFallback>
                      </Avatar>

                      <div>{`${reservation.customer.firstName} ${reservation.customer.lastName}`}</div>
                    </>
                  ) : (
                    <>
                      <Avatar>
                        <AvatarImage src={getURLByAttachment(reservation.customer.avatar)} />
                        <AvatarFallback>
                          {getInitials(
                            reservation.customer.firstName,
                            reservation.customer.lastName,
                          )}
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
                    <DropdownMenuContent align="end" aria-disabled={isLoadingStatus}>
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      {isBusiness && (
                        <>
                          <DropdownMenuItem
                            onClick={() => navigate(`/customer/${reservation.customer.id}`)}
                          >
                            View customer
                          </DropdownMenuItem>

                          {reservation.status === ReservationStatus.PENDING && (
                            <DropdownMenuItem
                              onClick={() =>
                                onUpdateStatus(reservation.id, ReservationStatus.CONFIRMED)
                              }
                            >
                              Confirm
                            </DropdownMenuItem>
                          )}

                          {reservation.status === ReservationStatus.CONFIRMED && (
                            <>
                              <DropdownMenuItem
                                onClick={() =>
                                  onUpdateStatus(reservation.id, ReservationStatus.NO_SHOW)
                                }
                              >
                                The customer didn&apos;t show up
                              </DropdownMenuItem>

                              <DropdownMenuItem
                                onClick={() =>
                                  onUpdateStatus(reservation.id, ReservationStatus.COMPLETED)
                                }
                              >
                                Complete
                              </DropdownMenuItem>
                            </>
                          )}
                        </>
                      )}

                      {isCustomer && (
                        <>
                          <DropdownMenuItem
                            onClick={() => navigate(`/company/${reservation.business.id}`)}
                          >
                            View company
                          </DropdownMenuItem>

                          {![
                            ReservationStatus.NO_SHOW,
                            ReservationStatus.CONFIRMED,
                            ReservationStatus.CANCELED,
                          ].includes(reservation.status) && (
                            <DropdownMenuItem
                              onClick={() => setReservationToReschedule(reservation)}
                            >
                              Reschedule
                            </DropdownMenuItem>
                          )}
                        </>
                      )}

                      {![
                        ReservationStatus.NO_SHOW,
                        ReservationStatus.CONFIRMED,
                        ReservationStatus.CANCELED,
                      ].includes(reservation.status) && (
                        <DropdownMenuItem
                          onClick={() => onUpdateStatus(reservation.id, ReservationStatus.CANCELED)}
                        >
                          Cancel
                        </DropdownMenuItem>
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

      <ChoseDateAndTimeModal
        onClose={() => setReservationToReschedule(undefined)}
        show={Boolean(reservationToReschedule)}
        reservation={reservationToReschedule}
        onBook={() => refetch()}
        services={[]}
      />
    </>
  );
};
