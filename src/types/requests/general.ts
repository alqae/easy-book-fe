export interface ApiResponse<T = any> {
  data: T;
  message: string;
}

export interface ApiError {
  message: string;
  errors: string[];
}

export interface PaginatedResponse<T> {
  items: T[];
  count: number;
}

export interface PaginatedRequest {
  limit: number;
  offset: number;
}
