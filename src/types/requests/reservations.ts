import { ReservationStatus } from '../enums';
import { Service } from '../models';

export interface CreateReservationRequest {
  startTime: string;
  endTime: string;
  serviceId: Service['id'];
}

export interface UpdateReservationRequest {
  status?: ReservationStatus;
  startTime?: string;
  endTime?: string;
}
