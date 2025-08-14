import type { SortOption } from '@/types/user';

export const SORT_OPTIONS: SortOption[] = [
  {
    label: 'Fecha de creación (más reciente)',
    value: 'created_at:desc',
    field: 'created_at',
    direction: 'desc'
  },
  {
    label: 'Fecha de creación (más antigua)',
    value: 'created_at:asc',
    field: 'created_at',
    direction: 'asc'
  },
  {
    label: 'Nombre (A-Z)',
    value: 'name:asc',
    field: 'name',
    direction: 'asc'
  },
  {
    label: 'Nombre (Z-A)',
    value: 'name:desc',
    field: 'name',
    direction: 'desc'
  }
];

export const DEFAULT_SORT = 'created_at:desc';
export const DEBOUNCE_DELAY = 300;
