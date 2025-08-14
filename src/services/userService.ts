import { api } from './api';
import type { User, CreateUserDTO, UpdateUserDTO, UserAnalytics, UserPaginatedResponse, PageSize } from '@/types/user';

export const userService = {
  async getUsers(filters: {
    q?: string;
    sort?: string; 
    page?: number;
    pageSize?: PageSize;
  } = {}): Promise<UserPaginatedResponse> {
    const { q, sort, page = 1, pageSize = 10 } = filters;
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    if (sort) params.set('sort', sort);
    params.set('page', page.toString());
    params.set('pageSize', pageSize.toString());
    
    return api.get<UserPaginatedResponse>(`/users?${params.toString()}`);
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