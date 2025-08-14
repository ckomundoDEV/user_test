'use client';

import React, { useState } from 'react';
import { useDebounce } from '@/hooks';
import { IoIosSearch } from 'react-icons/io';
import { DEBOUNCE_DELAY, PLACEHOLDERS } from '@/constants';

type SearchInputProps = {
  onSearch: (query: string) => void;
  placeholder?: string;
};

export const SearchInput: React.FC<SearchInputProps> = ({ 
  onSearch, 
  placeholder = PLACEHOLDERS.SEARCH 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, DEBOUNCE_DELAY);

  React.useEffect(() => {
    onSearch(debouncedSearchTerm);
  }, [debouncedSearchTerm, onSearch]);

  return (
    <div className="relative w-full ">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <IoIosSearch  className="h-5 w-5 text-gray-400"/>
      </div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder={placeholder}
        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
      />
    </div>
  );
};