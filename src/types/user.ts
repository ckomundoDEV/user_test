export interface User {
  id: number;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface CreateUserDTO {
  name: string;
  email: string;
}

export interface UpdateUserDTO {
  name?: string;
  email?: string;
}

export interface UserAnalytics {
  totalUsers: number;
  totalPageViews: number;
  recentUsers: Array<{
    id: string | number;
    name: string;
    email: string;
    created_at: string;
  }>;
  analytics?: unknown[];
} 

// Sorting
export enum SortDirectionEnum {
  ASC = 'asc',
  DESC = 'desc'
}

export enum UserOrderFieldEnum {
  CREATED_AT = 'created_at',
  NAME = 'name'
}

export type SortField = 'created_at' | 'name';
export type SortDirection = 'asc' | 'desc';

export interface SortOption {
  label: string;
  value: string;
  field: SortField;
  direction: SortDirection;
}

// Pagination
export type PageSize = 5 | 10 | 20;

export interface PaginationParams {
  page: number;
  pageSize: PageSize;
}

export interface PaginationMeta {
  total: number;
  page: number;
  pageSize: PageSize;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginatedResponse<T> {
  items: T[];
  meta: PaginationMeta;
}

export interface UserPaginatedResponse extends PaginatedResponse<User> {}