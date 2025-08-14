import { useState, useCallback } from 'react';
import type { User } from '@/types/user';

interface UserModalState {
  isOpen: boolean;
  userToEdit: User | undefined;
  mode: 'create' | 'edit';
}

export const useUserModal = () => {
  const [modalState, setModalState] = useState<UserModalState>({
    isOpen: false,
    userToEdit: undefined,
    mode: 'create'
  });

  const openCreateModal = useCallback(() => {
    setModalState({
      isOpen: true,
      userToEdit: undefined,
      mode: 'create'
    });
  }, []);

  const openEditModal = useCallback((user: User) => {
    setModalState({
      isOpen: true,
      userToEdit: user,
      mode: 'edit'
    });
  }, []);

  const closeModal = useCallback(() => {
    setModalState({
      isOpen: false,
      userToEdit: undefined,
      mode: 'create'
    });
  }, []);

  const isEditMode = modalState.mode === 'edit';
  const isCreateMode = modalState.mode === 'create';

  return {
    isModalOpen: modalState.isOpen,
    userToEdit: modalState.userToEdit,
    mode: modalState.mode,
    isEditMode,
    isCreateMode,
    openCreateModal,
    openEditModal,
    closeModal
  };
};
