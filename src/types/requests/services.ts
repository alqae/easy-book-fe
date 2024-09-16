import { Service } from '../models';

export interface CreateServiceRequest {
  name: string;
  description: string;
  duration: string;
  price: number;
}

export interface UpdateServiceRequest {
  name: string;
  description: string;
  duration: string;
  price: number;
}

export interface GetAviableHoursRequest {
  serviceId: Service['id'];
  date: string;
}
