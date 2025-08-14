import { api } from './api';
import type { User, CreateUserDTO, UpdateUserDTO, UserAnalytics, UserPaginatedResponse, PageSize } from '@/types/user';
import { API_ENDPOINTS } from '@/constants';
import { buildQueryString } from '@/utils';

export const userService = {
  async getUsers(filters: {
    q?: string;
    sort?: string; 
    page?: number;
    pageSize?: PageSize;
  } = {}): Promise<UserPaginatedResponse> {
    const queryString = buildQueryString(filters);
    const endpoint = queryString ? `${API_ENDPOINTS.USERS}?${queryString}` : API_ENDPOINTS.USERS;
    return api.get<UserPaginatedResponse>(endpoint);
  },

  async getUserById(id: string): Promise<User> {
    return api.get<User>(API_ENDPOINTS.USER_BY_ID(id));
  },

  async createUser(user: CreateUserDTO): Promise<User> {
    return api.post<User>(API_ENDPOINTS.USERS, user);
  },

  async updateUser(
    id: string,
    user: UpdateUserDTO
  ): Promise<User> {
    return api.put<User>(API_ENDPOINTS.USER_BY_ID(id), user);
  },

  async deleteUser(id: string): Promise<void> {
    return api.delete<void>(API_ENDPOINTS.USER_BY_ID(id));
  },

  async getAnalytics(): Promise<UserAnalytics> {
    return api.get<UserAnalytics>(API_ENDPOINTS.ANALYTICS);
  },
}; 