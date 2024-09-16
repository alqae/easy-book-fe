import { FaMoneyBillWave } from 'react-icons/fa';
import { LuAlarmClock } from 'react-icons/lu';
import React from 'react';

import { DeleteServiceModal } from '@/components/modals/DeleteServiceModal';
import { ServiceModal } from '@/components/modals/ServiceModal';
import { selectUserLogged } from '@/store/slices/profile.slice';
import { Button } from '@/components/ui/button';
import { useAppSelector } from '@/store/hooks';
import { Service } from '@/types/models';

export const ManageServices: React.FC = () => {
  const [serviceToUpdate, setServiceToUpdate] = React.useState<Service>();
  const [serviceToDelete, setServiceToDelete] = React.useState<Service>();
  const [showModal, setShowModal] = React.useState(false);

  const userLogged = useAppSelector(selectUserLogged);

  return (
    <>
      <div className="space-y-4">
        <h3 className="text-lg font-bold tracking-tight">Manage my services</h3>

        <ul className="w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg">
          {userLogged?.services.map((service) => (
            <li key={service.id} className="w-full px-4 py-2 border-b border-gray-200">
              <h4>{service.name}</h4>
              <p className="text-muted-foreground">{service.description}</p>

              <p className="text-muted-foreground">
                <FaMoneyBillWave className="inline-block me-2" />
                $&nbsp;{service.price}
              </p>

              <p className="text-muted-foreground">
                <LuAlarmClock className="inline-block me-2" />
                {service.duration}
              </p>

              <div className="space-x-2 mt-4">
                <Button onClick={() => setServiceToUpdate(service)}>Edit</Button>
                <Button variant="destructive" onClick={() => setServiceToDelete(service)}>
                  Delete
                </Button>
              </div>
            </li>
          ))}
        </ul>

        <Button onClick={() => setShowModal(true)}>New</Button>
      </div>

      {/* Delete */}
      <DeleteServiceModal service={serviceToDelete} onClose={() => setServiceToDelete(undefined)} />

      {/* Update */}
      <ServiceModal
        show={Boolean(serviceToUpdate)}
        onClose={() => setServiceToUpdate(undefined)}
        defaultValue={serviceToUpdate}
      />

      {/* Create */}
      <ServiceModal show={showModal} onClose={() => setShowModal(false)} />
    </>
  );
};
