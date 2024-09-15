import { UserRole, UserStatus } from '../enums';
import { Reservation } from './reservation';
import { Attachment } from './attachment';
import { Service } from './service';

export class User {
  id: number;

  firstName: string;

  lastName: string;

  email: string;

  status: UserStatus;

  role: UserRole;

  phoneNumber: string;

  password: string;

  description: string;

  country: string;

  city: string;

  verifyEmailAt: string;

  businessId: number;

  address: string;

  services: Service[];

  customerReservations: Reservation[];

  businessReservations: Reservation[];

  avatar?: Attachment;

  constructor(
    id: number,
    firstName: string,
    lastName: string,
    email: string,
    status: UserStatus,
    role: UserRole,
    phoneNumber: string,
    password: string,
    description: string,
    country: string,
    city: string,
    verifyEmailAt: string,
    businessId: number,
    address: string,
    services: Service[],
    customerReservations: Reservation[],
    businessReservations: Reservation[],
    avatar?: Attachment,
  ) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.status = status;
    this.role = role;
    this.phoneNumber = phoneNumber;
    this.password = password;
    this.description = description;
    this.country = country;
    this.city = city;
    this.verifyEmailAt = verifyEmailAt;
    this.businessId = businessId;
    this.address = address;
    this.services = services;
    this.customerReservations = customerReservations;
    this.businessReservations = businessReservations;
    this.avatar = avatar;
  }
}
