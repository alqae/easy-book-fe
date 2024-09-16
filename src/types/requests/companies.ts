import { PaginatedRequest } from './general';

export interface SearchCompaniesRequest extends PaginatedRequest {
  text?: string;
  city?: string;
  country?: string;
}
