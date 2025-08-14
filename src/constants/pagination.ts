import type { PageSize } from '@/types/user';

export const PAGE_SIZE_OPTIONS: { value: PageSize; label: string }[] = [
  { value: 5, label: '5 por página' },
  { value: 10, label: '10 por página' },
  { value: 20, label: '20 por página' }
];

export const DEFAULT_PAGE_SIZE: PageSize = 10;
export const DEFAULT_PAGE = 1;
export const MAX_PAGE_SIZE = 50;
export const MIN_PAGE = 1;
