import { api } from './api';
import type { User, CreateUserDTO, UpdateUserDTO, UserAnalytics } from '@/types/user';

export const userService = {
async getUsers(query?: string, sort?: string): Promise<User[]> {
  const params = new URLSearchParams();
  if (query) params.set('q', query);
  if (sort) params.set('sort', sort);
  
  const queryString = params.toString();
  return api.get<User[]>(`/users${queryString ? `?${queryString}` : ''}`);
},

  async getUserById(id: string): Promise<User> {
    return api.get<User>(`/users/${id}`);
  },

  async createUser(user: CreateUserDTO): Promise<User> {
    return api.post<User>('/users', user);
  },

  async updateUser(
    id: string,
    user: UpdateUserDTO
  ): Promise<User> {
    return api.put<User>(`/users/${id}`, user);
  },

  async deleteUser(id: string): Promise<void> {
    return api.delete<void>(`/users/${id}`);
  },

  async getAnalytics(): Promise<UserAnalytics> {
    return api.get<UserAnalytics>('/analytics');
  },
}; 