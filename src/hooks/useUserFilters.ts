import { useState, useCallback } from 'react';
import type { PageSize } from '@/types/user';
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, DEFAULT_SORT } from '@/constants';

interface UserFilters {
  searchQuery: string;
  sortQuery: string;
  currentPage: number;
  pageSize: PageSize;
}

export const useUserFilters = () => {
  const [filters, setFilters] = useState<UserFilters>({
    searchQuery: '',
    sortQuery: DEFAULT_SORT,
    currentPage: DEFAULT_PAGE,
    pageSize: DEFAULT_PAGE_SIZE
  });

  const handleSearch = useCallback((query: string) => {
    setFilters(prev => ({
      ...prev,
      searchQuery: query,
      currentPage: DEFAULT_PAGE // Reset to first page when searching
    }));
  }, []);

  const handleSort = useCallback((sort: string) => {
    setFilters(prev => ({
      ...prev,
      sortQuery: sort,
      currentPage: DEFAULT_PAGE // Reset to first page when sorting
    }));
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setFilters(prev => ({
      ...prev,
      currentPage: page
    }));
  }, []);

  const handlePageSizeChange = useCallback((newPageSize: PageSize) => {
    setFilters(prev => ({
      ...prev,
      pageSize: newPageSize,
      currentPage: DEFAULT_PAGE // Reset to first page when changing page size
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      searchQuery: '',
      sortQuery: DEFAULT_SORT,
      currentPage: DEFAULT_PAGE,
      pageSize: DEFAULT_PAGE_SIZE
    });
  }, []);

  const getQueryParams = useCallback(() => {
    return {
      q: filters.searchQuery || undefined,
      sort: filters.sortQuery,
      page: filters.currentPage,
      pageSize: filters.pageSize
    };
  }, [filters]);

  return {
    filters,
    handleSearch,
    handleSort,
    handlePageChange,
    handlePageSizeChange,
    resetFilters,
    getQueryParams
  };
};
