'use client';

import React from 'react';
import type { SortOption } from '@/types/user';

type SortSelectProps = {
  value: string;
  onChange: (sortValue: string) => void;
};

const sortOptions: SortOption[] = [
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

export const SortSelect: React.FC<SortSelectProps> = ({ value, onChange }) => {
  return (
    <div className="flex items-center space-x-2 w-1/3">
      <label htmlFor="sort-select" className="text-sm font-medium text-gray-700">
        Ordenar por:
      </label>
      <select
        id="sort-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="block w-auto px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};