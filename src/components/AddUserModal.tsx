import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createUserSchema, type CreateUserFormData } from '@/schemas/user';
import type { User } from '@/types/user';
import { useEffect } from 'react';

type AddUserModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onAddUserSubmit: (data: CreateUserFormData) => Promise<User>;
  onApiError: (message: string) => void;
  userToEdit?: User;
};

export const AddUserModal: React.FC<AddUserModalProps> = ({ 
  isOpen, 
  onClose, 
  onAddUserSubmit, 
  onApiError,
  userToEdit 
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, dirtyFields },
    reset,
    watch,
  } = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserSchema),
    mode: 'onTouched',
    defaultValues: {
      name: userToEdit?.name ?? '',
      email: userToEdit?.email ?? '',
    },
  });

  const currentValues = watch();

  const hasChanges = userToEdit ? (
    dirtyFields.name || dirtyFields.email ||
    currentValues.name !== userToEdit.name ||
    currentValues.email !== userToEdit.email
  ) : true;

  const onSubmit = async (data: CreateUserFormData) => {
    try {
      await onAddUserSubmit(data);
      reset();
      onClose();
    } catch (error: unknown) {
      if (error instanceof Error) {
        onApiError(`Error al ${userToEdit ? 'editar' : 'crear'} usuario: ${error.message}`);
      } else {
        onApiError(`Error inesperado al ${userToEdit ? 'editar' : 'crear'} usuario.`);
      }
    }
  };

  useEffect(() => {
    if (userToEdit) {
      reset({
        name: userToEdit.name,
        email: userToEdit.email,
      });
    } else {
      reset({
        name: '',
        email: '',
      });
    }
  }, [userToEdit, reset]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-auto">
        <h2 className="text-xl font-bold mb-4">
          {userToEdit ? 'Editar Usuario' : 'Agregar Usuario'}
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Nombre
            </label>
            <input
              type="text"
              id="name"
              {...register('name')}
              placeholder="Ingrese el nombre completo del usuario"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-3 text-base"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              {...register('email')}
              placeholder="ejemplo@correo.com"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-3 text-base"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !hasChanges}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Guardando...' : userToEdit ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}; 