import type { User } from '@/types/user';

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Juan Pérez',
    email: 'juan@example.com',
    created_at: '2024-03-15T10:00:00Z'
  },
  {
    id: '2',
    name: 'María García',
    email: 'maria@example.com',
    created_at: '2024-03-15T11:30:00Z'
  },
  {
    id: '3',
    name: 'Carlos López',
    email: 'carlos@example.com',
    created_at: '2024-03-15T14:45:00Z'
  }
];

export const generateMockUser = (name: string, email: string): User => ({
  id: (mockUsers.length + 1).toString(),
  name,
  email,
  created_at: new Date().toISOString()
}); 