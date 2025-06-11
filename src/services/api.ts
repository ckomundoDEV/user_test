const API_BASE_URL = '/api';

export const api = {
  async get<T>(endpoint: string): Promise<T> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Error al obtener ${endpoint}: ${response.statusText}`);
      }
      
      const data: T = await response.json();
      return data;
    } catch (error) {
      console.error(`Error en la petición GET a ${endpoint}:`, error);
      throw error; // Re-lanzar el error para que sea manejado por la capa de servicio o React Query
    }
  },

  async post<T>(endpoint: string, body: unknown): Promise<T> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Error al crear ${endpoint}: ${response.statusText}`);
      }
      
      const data: T = await response.json();
      return data;
    } catch (error) {
      console.error(`Error en la petición POST a ${endpoint}:`, error);
      throw error;
    }
  },

  async put<T>(endpoint: string, body: unknown): Promise<T> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Error al actualizar ${endpoint}: ${response.statusText}`);
      }
      
      const data: T = await response.json();
      return data;
    } catch (error) {
      console.error(`Error en la petición PUT a ${endpoint}:`, error);
      throw error;
    }
  },

  async delete<T>(endpoint: string): Promise<T> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'DELETE',
      });
      
      // Para DELETE, si la respuesta es 204 No Content, response.json() fallará.
      // Verificamos si hay contenido antes de intentar parsear como JSON.
      const text = await response.text();
      const data: T = text ? JSON.parse(text) : undefined; // Asumiendo que T puede ser undefined/void para 204

      if (!response.ok) {
        const errorData = text ? JSON.parse(text) : { error: 'Error desconocido' };
        throw new Error(errorData.error || `Error al eliminar ${endpoint}: ${response.statusText}`);
      }
      
      return data;
    } catch (error) {
      console.error(`Error en la petición DELETE a ${endpoint}:`, error);
      throw error;
    }
  },
}; 