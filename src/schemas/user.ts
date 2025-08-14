import { z } from 'zod';
import { ERROR_MESSAGES } from '@/constants';

// Validation schemas with improved error messages
export const createUserSchema = z.object({
  name: z
    .string({ required_error: 'El nombre es obligatorio' })
    .min(1, 'El nombre es obligatorio')
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre no puede tener más de 50 caracteres')
    .regex(
      /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
      'El nombre solo puede contener letras, espacios y acentos'
    )
    .refine(
      (value) => value.trim().length >= 2,
      'El nombre debe tener al menos 2 caracteres sin espacios'
    )
    .refine(
      (value) => !value.match(/^\s+|\s+$/),
      'El nombre no puede empezar o terminar con espacios'
    ),
  email: z
    .string({ required_error: 'El email es obligatorio' })
    .min(1, 'El email es obligatorio')
    .email('Ingresa un email válido (ej: usuario@dominio.com)')
    .min(5, 'El email debe tener al menos 5 caracteres')
    .max(100, 'El email no puede tener más de 100 caracteres')
    .toLowerCase()
    .refine(
      (value) => !value.includes('..'),
      'El email no puede contener puntos consecutivos'
    )
    .refine(
      (value) => !value.startsWith('.') && !value.endsWith('.'),
      'El email no puede empezar o terminar con punto'
    )
});

export type CreateUserFormData = z.infer<typeof createUserSchema>; 