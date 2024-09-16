import React from 'react';

import { fetchProfile } from '@/store/slices/profile.slice';
import { useDeleteServiceMutation } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { useAppDispatch } from '@/store/hooks';
import { Service } from '@/types/models';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export interface DeleteServiceModalProps {
  // eslint-disable-next-line react/require-default-props
  service?: Service;
  onClose: () => void;
}

export const DeleteServiceModal: React.FC<DeleteServiceModalProps> = ({ service, onClose }) => {
  const [deleteService, { isLoading }] = useDeleteServiceMutation();

  const dispatch = useAppDispatch();

  const onDelete = () => {
    if (!service) return;

    deleteService(service.id).then(() => {
      dispatch(fetchProfile());
      onClose();
    });
  };

  return (
    <Dialog open={Boolean(service)} onOpenChange={(x) => !x && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure you want to delete this service?</DialogTitle>
          <DialogDescription>
            The service <b>{service?.name}</b> will be deleted, this action cannot be undone.
          </DialogDescription>

          <DialogFooter>
            <Button onClick={onDelete} variant="destructive" disabled={isLoading}>
              Delete
            </Button>

            <Button onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
