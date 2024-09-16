import { User } from '../models';

export interface SearchCompaniesRequest {
  // filters
  text?: string;
  city?: string;
  country?: string;

  // pagination
  limit: number;
  offset: number;
}

export interface SearchCompaniesResponse {
  items: User[];
  count: number;
}
