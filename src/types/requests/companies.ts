export interface SearchCompaniesRequest {
  // filters
  text?: string;
  city?: string;
  country?: string;

  // pagination
  limit: number;
  offset: number;
}
