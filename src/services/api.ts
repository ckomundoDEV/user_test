import type { ApiError } from '@/types/api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

export const api = {
  async get<T>(endpoint: string): Promise<T> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error((data as ApiError).error || `Error al obtener ${endpoint}: ${response.statusText}`);
      }
      
      return data as T;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      console.error(`Error en la petición GET a ${endpoint}:`, errorMessage);
      throw new Error(errorMessage);
    }
  },

  async post<T>(endpoint: string, body: unknown): Promise<T> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      
      const data = await response.json();

      if (!response.ok) {
        throw new Error((data as ApiError).error || `Error al crear ${endpoint}: ${response.statusText}`);
      }
      
      return data as T;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      console.error(`Error en la petición POST a ${endpoint}:`, errorMessage);
      throw new Error(errorMessage);
    }
  },

  async put<T>(endpoint: string, body: unknown): Promise<T> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      
      const data = await response.json();

      if (!response.ok) {
        throw new Error((data as ApiError).error || `Error al actualizar ${endpoint}: ${response.statusText}`);
      }
      
      return data as T;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      console.error(`Error en la petición PUT a ${endpoint}:`, errorMessage);
      throw new Error(errorMessage);
    }
  },

  async delete<T>(endpoint: string): Promise<T> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'DELETE',
      });
      
      const text = await response.text();
      const data: T = text ? JSON.parse(text) : undefined as T;

      if (!response.ok) {
        const errorData = text ? JSON.parse(text) as ApiError : { error: 'Error desconocido' };
        throw new Error(errorData.error || `Error al eliminar ${endpoint}: ${response.statusText}`);
      }
      
      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      console.error(`Error en la petición DELETE a ${endpoint}:`, errorMessage);
      throw new Error(errorMessage);
    }
  },
}; 