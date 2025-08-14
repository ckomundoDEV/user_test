'use client';

import React from 'react';
import { SORT_OPTIONS } from '@/constants';

type SortSelectProps = {
  value: string;
  onChange: (sortValue: string) => void;
};

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
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};