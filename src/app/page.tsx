'use client';

import { useEffect, useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { User, CreateUserDTO, UserAnalytics } from '@/types/user';

import { userService } from '@/services/userService';

import UserTable from '@/components/UserTable';
import { AddUserModal } from '@/components/AddUserModal';
import { ErrorModal } from '@/components/ErrorModal';
import { LoadingModal } from '@/components/LoadingModal';
import { SearchInput } from '@/components/SearchInput';
import { SortSelect } from '@/components/SortSelect';
import { RecentUsersDropdown } from '@/components/RecentUsersDropdown';

export default function Home() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [userToEdit, setUserToEdit] = useState<User | undefined>();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortQuery, setSortQuery] = useState('created_at:desc');


  const { data: users = [], isLoading, error: fetchError } = useQuery<User[], Error>({
    queryKey: ['users', searchQuery, sortQuery],
    queryFn: async () => userService.getUsers(searchQuery || undefined, sortQuery),
  });

  const { data: analytics } = useQuery<UserAnalytics, Error>({
    queryKey: ['analytics'],
    queryFn: async () => userService.getAnalytics(),
  });

  const { isPending: isDeleting, mutateAsync: deleteMutateAsync } = useMutation<void, Error, string>({
    mutationFn: async (id: string) => userService.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['users', searchQuery, sortQuery] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
    },
    onError: (err) => {
      setErrorMessage(err.message);
      setIsErrorModalOpen(true);
    },
  });

  const { isPending: isCreating, mutateAsync: createMutateAsync } = useMutation<User, Error, CreateUserDTO>({
    mutationFn: async (userData: CreateUserDTO) => {
      if (userToEdit) {
        return userService.updateUser(String(userToEdit.id), userData);
      }
      return userService.createUser(userData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] }); 
      queryClient.invalidateQueries({ queryKey: ['users', searchQuery, sortQuery] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
      setIsModalOpen(false);
      setUserToEdit(undefined);
    },
    onError: (err) => {
      setErrorMessage(err.message);
      setIsErrorModalOpen(true);
    },
  });

  const handleApiError = (message: string) => {
    setErrorMessage(message);
    setIsErrorModalOpen(true);
  };

  useEffect(() => {
    if (fetchError) {
      setErrorMessage(fetchError.message);
      setIsErrorModalOpen(true);
    }
  }, [fetchError]);

  const handleDeleteUserWrapper = async (id: string): Promise<void> => {
    await deleteMutateAsync(id);
  };

  const handleEditUser = (user: User) => {
    setUserToEdit(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setUserToEdit(undefined);
  };

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleSort = useCallback((sort: string) => {
    setSortQuery(sort);
  }, []);

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">Gestión de Usuarios</h1>
          {analytics && (
          
              <div className="bg-blue-50 px-4 py-2 rounded-lg">
                <span className="text-sm text-blue-700">Total Usuarios:</span>
                <span className="ml-2 font-bold text-blue-900">{analytics.totalUsers}</span>
              </div>
          
          )}
        </div>
        {analytics && analytics.recentUsers && analytics.recentUsers.length > 0 && (
          <RecentUsersDropdown users={analytics.recentUsers} />
        )}
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Agregar Usuario
        </button>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      {/* Campo de búsqueda */}
        <SearchInput 
          onSearch={handleSearch}
          placeholder="Buscar por nombre o email"
          />
        
          {/* Búsqueda y ordenamiento */}
        <SortSelect 
          value={sortQuery}
          onChange={handleSort}
        />
      </div>
      <UserTable
        users={users}
        onDeleteUser={handleDeleteUserWrapper}
        onEditUser={handleEditUser}
        isLoading={isLoading}
      />

      <AddUserModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onAddUserSubmit={createMutateAsync}
        onApiError={handleApiError}
        userToEdit={userToEdit}
      />

      <ErrorModal
        isOpen={isErrorModalOpen}
        message={errorMessage}
        onClose={() => setIsErrorModalOpen(false)}
      />

      <LoadingModal 
        isOpen={isLoading} 
        message="Cargando usuarios..." 
      />
      <LoadingModal 
        isOpen={isDeleting} 
        message="Eliminando usuario..." 
      />
      <LoadingModal 
        isOpen={isCreating} 
        message={userToEdit ? "Actualizando usuario..." : "Creando usuario..."} 
      />
    </main>
  );
} 