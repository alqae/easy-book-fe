import React from 'react';
import { ChevronLeftIcon } from '@radix-ui/react-icons';

import { useCreateReservationMutation, useLazyGetAviableHoursByDateQuery } from '@/lib/api';
import { getEndTime, getStartTime } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Service } from '@/types/models';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export interface ChoseDateAndTimeModalProps {
  services: Service[];
  show: boolean;
  onBook: (service: Service) => void;
  onClose: () => void;
}

export const ChoseDateAndTimeModal: React.FC<ChoseDateAndTimeModalProps> = ({
  show,
  onClose,
  onBook: onBookHandler,
  services = [],
}) => {
  const [selectedService, setSelectedService] = React.useState<Service>();
  const [showCalendar, setShowCalendar] = React.useState(true);
  const [selectedDay, setSelectedDay] = React.useState<Date>();
  const [selectedHour, setSelectedHour] = React.useState<string>();

  const [getAviableHours, { isLoading: isLoadingAviableHours, data: responseAviableHours }] =
    useLazyGetAviableHoursByDateQuery();
  const [createReservation, { isLoading: isLoadingReservation }] = useCreateReservationMutation();

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

  const onBook = async () => {
    if (!selectedDay || !selectedHour || !selectedService) {
      return;
    }

    const startTime = getStartTime(selectedHour, selectedDay);
    const endTime = getEndTime(startTime, selectedService.duration);

    await createReservation({
      serviceId: selectedService?.id,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
    }).then((response) => {
      if ('error' in response) {
        return;
      }

      toast({ variant: 'success', title: response.data.message });
      onBookHandler(selectedService);
      onClose();
    });
  };

  React.useEffect(() => {
    if (!selectedService) {
      setSelectedService(services[0]);
    }
  }, [services, selectedService]);

  // Reset calendar if hide modal
  React.useEffect(() => {
    if (!show) {
      setSelectedService(undefined);
      setSelectedDay(undefined);
      setSelectedHour(undefined);
      setShowCalendar(true);
    }
  }, [show]);

  const currentServiceIndex = React.useMemo(
    () => services.findIndex((s) => s.id === selectedService?.id) + 1,
    [services, selectedService],
  );

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
                serviceId: selectedService.id,
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
                disabled={isLoadingAviableHours || isLoadingReservation}
                variant="outline"
              >
                Change Day
              </Button>

              <Button
                disabled={!selectedDay || !selectedHour || isLoadingReservation}
                onClick={onBook}
              >
                Book
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
