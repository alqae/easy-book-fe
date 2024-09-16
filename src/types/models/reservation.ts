import { ReservationStatus } from '../enums';
import { Service } from './service';
import type { User } from './user';

export class Reservation {
  id: number;

  startTime: Date;

  endTime: Date;

  status: ReservationStatus;

  service: Service;

  business: User;

  customer: User;

  createdAt: Date;

  updatedAt: Date;

  constructor(
    id: number,
    startTime: Date,
    endTime: Date,
    status: ReservationStatus,
    service: Service,
    business: User,
    customer: User,
    createdAt: Date,
    updatedAt: Date,
  ) {
    this.id = id;
    this.startTime = startTime;
    this.endTime = endTime;
    this.status = status;
    this.service = service;
    this.business = business;
    this.customer = customer;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
