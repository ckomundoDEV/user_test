import type { PageSize } from '@/types/user';
import { SortDirectionEnum, UserOrderFieldEnum } from '@/types/user';

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate page number
 */
export const isValidPage = (page: number): boolean => {
  return Number.isInteger(page) && page >= 1;
};

/**
 * Validate page size
 */
export const isValidPageSize = (pageSize: number): pageSize is PageSize => {
  return [5, 10, 20].includes(pageSize);
};

/**
 * Validate sort format and values
 */
export const isValidSort = (sort: string): boolean => {
  if (!sort.includes(':')) return false;
  
  const [field, direction] = sort.split(':');
  
  return Object.values(UserOrderFieldEnum).includes(field as UserOrderFieldEnum) &&
         Object.values(SortDirectionEnum).includes(direction as SortDirectionEnum);
};

/**
 * Sanitize search query to prevent injection
 */
export const sanitizeSearchQuery = (query: string): string => {
  return query.trim().replace(/[%_]/g, '\\$&');
};

/**
 * Check if string is empty or whitespace only
 */
export const isEmpty = (str: string): boolean => {
  return !str || str.trim().length === 0;
};

/**
 * Validate user name format
 */
export const isValidUserName = (name: string): boolean => {
  const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
  return nameRegex.test(name) && name.trim().length >= 2 && name.trim().length <= 50;
};
