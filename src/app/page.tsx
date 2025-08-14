'use client';

import React from 'react';
import type { User, CreateUserDTO } from '@/types/user';

import UserTable from '@/components/UserTable';
import { AddUserModal } from '@/components/AddUserModal';
import { ErrorModal } from '@/components/ErrorModal';
import { LoadingModal } from '@/components/LoadingModal';
import { SearchInput } from '@/components/SearchInput';
import { SortSelect } from '@/components/SortSelect';
import { RecentUsersDropdown } from '@/components/RecentUsersDropdown';
import { Pagination } from '@/components/Pagination';

import { useUsers, useUserFilters, useUserModal, useErrorHandler } from '@/hooks';
import { LOADING_MESSAGES } from '@/constants';

export default function Home() {
  // Custom hooks para manejar el estado
  const filters = useUserFilters();
  const modal = useUserModal();
  const errorHandler = useErrorHandler();
  
  // Hook principal de usuarios con parámetros de filtros
  const usersData = useUsers(filters.getQueryParams());
  
  // Handlers para acciones de usuario
  const handleDeleteUser = async (id: string): Promise<void> => {
    try {
      await usersData.deleteUser(id);
    } catch (error) {
      errorHandler.handleApiError(error);
    }
  };

  const handleSaveUser = async (userData: CreateUserDTO): Promise<User> => {
    try {
      if (modal.userToEdit) {
        const result = await usersData.updateUser(String(modal.userToEdit.id), userData);
        modal.closeModal();
        return result;
      } else {
        const result = await usersData.createUser(userData);
        modal.closeModal();
        return result;
      }
    } catch (error) {
      errorHandler.handleApiError(error);
      throw error;
    }
  };
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">Gestión de Usuarios</h1>
          {usersData.analytics && (
            <div className="bg-blue-50 px-4 py-2 rounded-lg">
              <span className="text-sm text-blue-700">Total Usuarios:</span>
              <span className="ml-2 font-bold text-blue-900">{usersData.analytics.totalUsers}</span>
            </div>
          )}
        </div>
        {usersData.analytics?.recentUsers && usersData.analytics.recentUsers.length > 0 && (
          <RecentUsersDropdown users={usersData.analytics.recentUsers} />
        )}
        <button
          onClick={modal.openCreateModal}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Agregar Usuario
        </button>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <SearchInput 
          onSearch={filters.handleSearch}
        />
        <SortSelect 
          value={filters.filters.sortQuery}
          onChange={filters.handleSort}
        />
      </div>
      
      <UserTable
        users={usersData.users}
        onDeleteUser={handleDeleteUser}
        onEditUser={modal.openEditModal}
        isLoading={usersData.isLoadingData}
      />
      
      {usersData.paginationMeta && (
        <Pagination 
          meta={usersData.paginationMeta}
          pageSize={filters.filters.pageSize}
          onPageChange={filters.handlePageChange}
          onPageSizeChange={filters.handlePageSizeChange}
        />
      )}

      <AddUserModal
        isOpen={modal.isModalOpen}
        onClose={modal.closeModal}
        onAddUserSubmit={handleSaveUser}
        onApiError={errorHandler.showError}
        userToEdit={modal.userToEdit}
      />

      <ErrorModal
        isOpen={errorHandler.isErrorOpen}
        message={errorHandler.error}
        onClose={errorHandler.clearError}
      />

      <LoadingModal 
        isOpen={usersData.isLoading} 
        message={usersData.loadingMessage}
      />
    </main>
  );
} 