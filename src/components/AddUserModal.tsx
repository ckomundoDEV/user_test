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
    formState: { errors, isValid, isSubmitting, dirtyFields },
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

  // Observar los valores actuales del formulario
  const currentValues = watch();

  // Verificar si los valores han cambiado en modo edición
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            {userToEdit ? 'Editar Usuario' : 'Agregar Nuevo Usuario'}
          </h3>
          {userToEdit && (
            <div className="mt-2 text-sm text-gray-500">
              <p>ID: {userToEdit.id}</p>
              <p>Creado: {new Date(userToEdit.created_at).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}</p>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-4">
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Nombre
            </label>
            <input
              type="text"
              id="name"
              {...register('name')}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                errors.name 
                  ? 'border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              {...register('email')}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                errors.email 
                  ? 'border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          {userToEdit && !hasChanges && (
            <p className="mb-4 text-sm text-yellow-600">
              No se han realizado cambios en los datos del usuario.
            </p>
          )}

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => { reset(); onClose(); }}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!isValid || isSubmitting || (userToEdit && !hasChanges)}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isSubmitting ? 'Guardando...' : userToEdit ? 'Actualizar' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}; 