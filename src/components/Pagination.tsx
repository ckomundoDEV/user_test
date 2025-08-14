'use client';

import React from 'react';
import type { PageSize, PaginationMeta } from '@/types/user';
import { PAGE_SIZE_OPTIONS } from '@/constants';

type PaginationProps = {
  meta: PaginationMeta;
  pageSize: PageSize;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: PageSize) => void;
};

export const Pagination: React.FC<PaginationProps> = ({
  meta,
  pageSize,
  onPageChange,
  onPageSizeChange
}) => {
  const { page, total, hasNextPage, hasPrevPage } = meta;
  
  // Calcular rango mostrado
  const startItem = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const endItem = Math.min(page * pageSize, total);

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6 p-4 bg-gray-50 border-t">
      {/* Contador de resultados */}
      <div className="text-sm text-gray-700">
        {total === 0 ? (
          'No se encontraron resultados'
        ) : (
          <>
            Mostrando <span className="font-semibold">{startItem}–{endItem}</span> de{' '}
            <span className="font-semibold">{total}</span> resultados
          </>
        )}
      </div>

      <div className="flex items-center gap-4">
        {/* Selector tamaño página */}
        <div className="flex items-center gap-2">
          <label htmlFor="page-size" className="text-sm text-gray-700">
            Mostrar:
          </label>
          <select
            id="page-size"
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value) as PageSize)}
            className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {PAGE_SIZE_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Controles navegación */}
        {total > 0 && (
          <div className="flex items-center gap-1">
            <button
              onClick={() => onPageChange(page - 1)}
              disabled={!hasPrevPage}
              className="px-3 py-1 text-sm border border-gray-300 rounded-l hover:bg-gray-100 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              Anterior
            </button>
            
            <span className="px-3 py-1 text-sm bg-blue-500 text-white border-t border-b border-blue-500">
              {page}
            </span>
            
            <button
              onClick={() => onPageChange(page + 1)}
              disabled={!hasNextPage}
              className="px-3 py-1 text-sm border border-gray-300 rounded-r hover:bg-gray-100 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              Siguiente
            </button>
          </div>
        )}
      </div>
    </div>
  );
};