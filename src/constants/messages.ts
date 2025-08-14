// Error messages
export const ERROR_MESSAGES = {
  // API Errors
  FETCH_USERS: 'Error al obtener usuarios',
  CREATE_USER: 'Error al crear usuario',
  UPDATE_USER: 'Error al actualizar usuario',
  DELETE_USER: 'Error al eliminar usuario',
  FETCH_ANALYTICS: 'Error al obtener analytics',

  // Validation Errors
  REQUIRED_FIELDS: 'Nombre y email son requeridos',
  INVALID_EMAIL: 'El email ya está registrado',
  USER_NOT_FOUND: 'Usuario no encontrado',
  INVALID_PAGE: 'El parámetro page debe ser mayor a 0',
  INVALID_PAGE_SIZE: 'El parámetro pageSize debe ser 5, 10 o 20',
  INVALID_SORT_FORMAT:
    'El parámetro sort debe tener formato campo:direccion (ej: created_at:desc)',

  // Generic
  UNKNOWN_ERROR: 'Error desconocido',
  NETWORK_ERROR: 'Error de conexión',
} as const;

// (Mensajes de éxito eliminados por no uso)

// Loading messages
export const LOADING_MESSAGES = {
  LOADING_USERS: 'Cargando usuarios...',
  CREATING_USER: 'Creando usuario...',
  UPDATING_USER: 'Actualizando usuario...',
  DELETING_USER: 'Eliminando usuario...',
} as const;

// Placeholders
export const PLACEHOLDERS = {
  SEARCH: 'Buscar por nombre o email',
  USER_NAME: 'Ingrese el nombre completo del usuario',
  USER_EMAIL: 'ejemplo@correo.com',
} as const;
