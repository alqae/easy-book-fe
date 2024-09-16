import React from 'react';
import { LuAlarmClock } from 'react-icons/lu';
import { FaMoneyBillWave, FaTrash } from 'react-icons/fa6';

import { ChoseDateAndTimeModal } from '@/components/modals/ChoseDateAndTime';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Service } from '@/types/models';
import { cn } from '@/lib/utils';

export interface ServicesTabProps {
  services: Service[];
  value: Service[];
  onChange: (services: Service[]) => void;
}

export const ServicesTab: React.FC<ServicesTabProps> = ({ services = [], value, onChange }) => {
  const [showChoseDateAndTimeModal, setShowChoseDateAndTimeModal] = React.useState(false);

  const handleSelectService = (service: Service) => {
    if (value.find((s) => s.id === service.id)) {
      onChange(value.filter((s) => s.id !== service.id));
    } else {
      onChange([...value, service]);
    }
  };

  return (
    <>
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-8 border shadow-md rounded-md">
          {services.map((service, index) => (
            <React.Fragment key={service.id}>
              <button
                className={cn(
                  'p-4',
                  'w-full',
                  'text-left',
                  'hover:bg-muted',
                  'hover:cursor-pointer',
                  value.find((s) => s.id === service.id) && 'bg-muted',
                )}
                onClick={() => handleSelectService(service)}
              >
                <span className="font-bold text-lg">{service.name}</span>
                <br />
                <span className="text-sm text-muted-foreground">{service.description}</span>
                <div className="space-x-2 text-sm text-muted-foreground">
                  <FaMoneyBillWave className="inline" />
                  <span>${service.price}</span>
                </div>
                <div className="space-x-2 text-sm text-muted-foreground">
                  <LuAlarmClock className="inline" />
                  <span>{service.duration}</span>
                </div>
              </button>

              {index !== services.length - 1 && <Separator />}
            </React.Fragment>
          ))}
        </div>

        <div className="col-span-4">
          <div className="border shadow-md p-4 rounded-md ">
            <h4 className="text-xl font-bold">Your Visit</h4>

            <Separator className="my-4" />

            {value.map((service) => (
              <React.Fragment key={service.id}>
                <div className="flex flex-row justify-between items-center gap-2">
                  <span className="font-bold text-sm flex-1">{service.name}</span>
                  <span className="text-sm text-muted-foreground">${service.price}</span>
                  <Button
                    size="icon"
                    variant="link"
                    className="p-0 text-destructive"
                    onClick={() => handleSelectService(service)}
                  >
                    <FaTrash />
                  </Button>
                </div>
                <Separator className="my-2" />
              </React.Fragment>
            ))}

            <span className="text-sm text-foreground block mb-2 text-center">
              Add another from the list, or
            </span>

            <Button
              className="w-full"
              disabled={!value.length}
              onClick={() => setShowChoseDateAndTimeModal(true)}
            >
              Choose Date and Time
            </Button>
          </div>
        </div>
      </div>

      <ChoseDateAndTimeModal
        services={value}
        show={showChoseDateAndTimeModal}
        onBook={(service) => {
          if (value.length > 1) {
            handleSelectService(service);
          } else if (value.length === 1) {
            onChange([]);
            setShowChoseDateAndTimeModal(false);
          }
        }}
        onClose={() => setShowChoseDateAndTimeModal(false)}
      />
    </>
  );
};
