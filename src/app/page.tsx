'use client';

import { useEffect, useState } from 'react';
import UserTable from '@/components/UserTable';
import LoadingSpinner from '@/components/LoadingSpinner';
import { AddUserModal } from '@/components/AddUserModal';
import { ErrorModal } from '@/components/ErrorModal';
import { userService } from '@/services/userService';
import type { User, CreateUserDTO } from '@/types/user';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export default function Home() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [userToEdit, setUserToEdit] = useState<User | undefined>();

  const { data: users = [], isLoading, error: fetchError } = useQuery<User[], Error>({
    queryKey: ['users'],
    queryFn: async () => userService.getUsers(),
  });

  const { isPending: isDeleting, mutateAsync: deleteMutateAsync } = useMutation<void, Error, string>({
    mutationFn: async (id: string) => userService.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
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

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestión de Usuarios</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Agregar Usuario
        </button>
      </div>

      {isOverallLoading && <LoadingSpinner />}

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
    </main>
  );
} 