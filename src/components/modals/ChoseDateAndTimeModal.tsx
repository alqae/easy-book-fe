import React from 'react';
import { ChevronLeftIcon } from '@radix-ui/react-icons';

import { getEndTime, getStartTime } from '@/lib/utils';
import { Reservation, Service } from '@/types/models';
import { Calendar } from '@/components/ui/calendar';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { ApiResponse } from '@/types/requests';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  useCreateReservationMutation,
  useLazyGetAviableHoursByDateQuery,
  useUpdateReservationMutation,
} from '@/lib/api';
import { ReservationStatus } from '@/types/enums';

export interface ChoseDateAndTimeModalProps {
  show: boolean;
  onClose: () => void;
  services: Service[];
  onBook: (service: Service) => void;
  // eslint-disable-next-line react/require-default-props
  reservation?: Reservation;
}

export const ChoseDateAndTimeModal: React.FC<ChoseDateAndTimeModalProps> = ({
  show,
  onClose,
  onBook: onBookHandler,
  services = [],
  reservation,
}) => {
  const [selectedService, setSelectedService] = React.useState<Service>();
  const [showCalendar, setShowCalendar] = React.useState(true);
  const [selectedDay, setSelectedDay] = React.useState<Date>();
  const [selectedHour, setSelectedHour] = React.useState<string>();

  const [getAviableHours, { isLoading: isLoadingAviableHours, data: responseAviableHours }] =
    useLazyGetAviableHoursByDateQuery();
  const [createReservation, { isLoading: isLoadingCreating }] = useCreateReservationMutation();
  const [updateReservation, { isLoading: isLoadingUpdating }] = useUpdateReservationMutation();

  const aviableHours = React.useMemo(() => {
    if (!responseAviableHours) {
      return [];
    }

    return responseAviableHours.data;
  }, [responseAviableHours]);

  const handlePreviousService = () => {
    const isLast = selectedService === services[services.length - 1];

    if (isLast) {
      setSelectedService(services[0]);
    } else {
      const index = services.findIndex((s) => s.id === selectedService?.id);
      setSelectedService(services[index + 1]);
    }
  };

  const handleNextService = () => {
    const isFirst = selectedService === services[0];

    if (isFirst) {
      setSelectedService(services[services.length - 1]);
    } else {
      const index = services.findIndex((s) => s.id === selectedService?.id);
      setSelectedService(services[index - 1]);
    }
  };

  const reset = () => {
    setSelectedService(undefined);
    setSelectedDay(undefined);
    setSelectedHour(undefined);
    setShowCalendar(true);
  };

  const onBook = async () => {
    if (!selectedDay || !selectedHour || !selectedService) {
      return;
    }

    const startTime = getStartTime(selectedHour, selectedDay);
    const endTime = getEndTime(startTime, selectedService.duration);

    let response: ApiResponse;

    if (reservation) {
      const result = await updateReservation([
        reservation.id,
        {
          status: ReservationStatus.RESCHEDULED,
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
        },
      ]);

      response = (result as ApiResponse).data;
    } else {
      const result = await createReservation({
        serviceId: selectedService?.id,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
      });

      response = (result as ApiResponse).data;
    }

    toast({ variant: 'success', title: response.message });
    onBookHandler(selectedService);

    if (services.length === 1 || reservation) {
      onClose();
    } else {
      handleNextService();
      reset();
    }
  };

  React.useEffect(() => {
    if (!selectedService) {
      if (reservation) {
        setSelectedService(reservation.service);
      } else {
        setSelectedService(services[0]);
      }
    }
  }, [services, selectedService, reservation]);

  // Reset calendar if hide modal
  React.useEffect(() => {
    if (!show) {
      reset();
    }
  }, [show]);

  const currentServiceIndex = React.useMemo(() => {
    if (services.length === 1 || !selectedService) {
      return 1;
    }

    return services.findIndex((s) => s.id === selectedService.id) + 1;
  }, [services, selectedService]);

  return (
    <Dialog open={show} onOpenChange={(x) => !x && onClose()}>
      <DialogContent className="max-w-xs">
        <DialogHeader>
          <DialogTitle className="text-center">Choose {showCalendar ? 'date' : 'time'}</DialogTitle>
          <DialogDescription className="text-center">
            Please select a date and time for your service. You can change this later.
          </DialogDescription>
        </DialogHeader>

        {services.length > 1 && (
          <div className="flex items-center gap-2 mt-4">
            <Button
              size="icon"
              variant="outline"
              onClick={handlePreviousService}
              disabled={services.length === 1 || isLoadingAviableHours}
            >
              <ChevronLeftIcon className="h-4 w-4" />
            </Button>

            <div className="flex-1 text-center">
              <span className="text-sm font-boldx">{selectedService?.name}</span>
              <br />
              <span className="text-sm text-muted-foreground">
                {currentServiceIndex}/{services.length}
              </span>
            </div>

            <Button
              size="icon"
              variant="outline"
              onClick={handleNextService}
              disabled={services.length === 1 || isLoadingAviableHours}
            >
              <ChevronLeftIcon className="h-4 w-4 rotate-180" />
            </Button>
          </div>
        )}

        {showCalendar ? (
          <Calendar
            mode="single"
            selected={selectedDay}
            onSelect={(day) => {
              if (!day || !selectedService) return;

              setSelectedDay(day);

              getAviableHours({
                date: day.toISOString(),
                serviceId: reservation ? reservation.service.id : selectedService.id,
              }).then(() => setShowCalendar(false));
            }}
            className="mx-auto"
          />
        ) : (
          <div className="grid grid-cols-3 gap-2 max-h-96 overflow-y-auto">
            {aviableHours.map((hour) => (
              <Button
                key={hour}
                onClick={() =>
                  selectedHour === hour ? setSelectedHour(undefined) : setSelectedHour(hour)
                }
                className="w-full mt-2"
                variant={selectedHour === hour ? 'default' : 'outline'}
              >
                {hour}
              </Button>
            ))}
          </div>
        )}

        <DialogFooter>
          {!selectedHour && showCalendar && (
            <Button onClick={onClose} variant="outline">
              Cancel
            </Button>
          )}

          {selectedDay && !showCalendar && (
            <>
              <Button
                onClick={() => {
                  setShowCalendar(true);
                  setSelectedDay(undefined);
                  setSelectedHour(undefined);
                }}
                disabled={isLoadingAviableHours || isLoadingCreating || isLoadingUpdating}
                variant="outline"
              >
                Change Day
              </Button>

              <Button
                disabled={!selectedDay || !selectedHour || isLoadingCreating || isLoadingUpdating}
                onClick={onBook}
              >
                {reservation ? 'Reschedule' : 'Book'}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
