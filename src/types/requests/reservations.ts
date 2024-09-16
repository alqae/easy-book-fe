import { Service } from '../models';

export interface CreateReservationRequest {
  startTime: string;
  endTime: string;
  serviceId: Service['id'];
}
