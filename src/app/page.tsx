'use client';

import { useEffect, useState } from 'react';
import UserTable from '@/components/UserTable';
import LoadingSpinner from '@/components/LoadingSpinner';
import { AddUserModal } from '@/components/AddUserModal';
import { ErrorModal } from '@/components/ErrorModal';
import { userService } from '@/services/userService';
import type { User, CreateUserDTO, UserAnalytics } from '@/types/user';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const initialFilter = {
  enabled: true,
  paramsToSend: { /* aquí irían parámetros de filtro si los hubiera, ej: name: '' */ },
} 

export default function Home() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [userToEdit, setUserToEdit] = useState<User | undefined>();

  // Simulación de los parámetros de la organización para la query
  const [queryOptions] = useState(initialFilter);

  const { data: users = [], isLoading, error: fetchError } = useQuery<User[], Error>({
    queryKey: ['users', queryOptions.paramsToSend],
    queryFn: async () => userService.getUsers(), 
    enabled: queryOptions.enabled,
  });

  const { data: analyticsData, error: analyticsError } = useQuery<UserAnalytics, Error>({
    queryKey: ['analytics'],
    queryFn: async () => userService.getAnalytics(),
  });

  const { isPending: isDeleting, mutateAsync: deleteMutateAsync } = useMutation<void, Error, string>({
    mutationFn: async (id: string) => userService.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
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
        return userService.updateUser(userToEdit.id, userData);
      }
      return userService.createUser(userData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] }); 
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
      setIsModalOpen(false);
      setUserToEdit(undefined);
    },
    onError: (err) => {
      setErrorMessage(err.message);
      setIsErrorModalOpen(true);
    },
  });

  const isOverallLoading = isLoading || isDeleting || isCreating; 

  const handleApiError = (message: string) => {
    setErrorMessage(message);
    setIsErrorModalOpen(true);
  };

  useEffect(() => {
    if (fetchError) {
      setErrorMessage(fetchError.message);
      setIsErrorModalOpen(true);
    } else if (analyticsError) {
      setErrorMessage(analyticsError.message);
      setIsErrorModalOpen(true);
    }
  }, [fetchError, analyticsError]);

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

  return (
    <main className="min-h-screen bg-gray-100 py-8">
      {isOverallLoading && <LoadingSpinner />}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow">
          <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Lista de Usuarios</h1>
              <p className="mt-1 text-sm text-gray-500">
                Total de usuarios: {analyticsData?.totalUsers ?? 'Cargando...'}
              </p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Agregar Usuario
            </button>
          </div>
          <UserTable 
            users={users} 
            onDeleteUser={handleDeleteUserWrapper}
            onEditUser={handleEditUser}
          />
        </div>
      </div>

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
    </main>
  );
} 