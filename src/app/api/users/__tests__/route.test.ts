/**
 * @jest-environment node
 */

// Mock NextResponse
const mockNextResponse = {
  json: jest.fn((data, init) => ({
    json: () => Promise.resolve(data),
    status: init?.status || 200,
  }))
};

jest.mock('next/server', () => ({
  NextResponse: mockNextResponse
}));

// Mock Supabase
const mockSupabaseQuery = {
  select: jest.fn().mockReturnThis(),
  or: jest.fn().mockReturnThis(),
  order: jest.fn().mockReturnThis(),
  range: jest.fn().mockReturnThis(),
};

jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: jest.fn(() => mockSupabaseQuery)
  }
}));

// Mock Request con URLSearchParams
class MockRequest {
  url: string;
  searchParams: URLSearchParams;
  
  constructor(url: string) {
    this.url = url;
    const urlObj = new URL(url);
    this.searchParams = urlObj.searchParams;
  }
  
  json() {
    return Promise.resolve({});
  }
}

(global as any).Request = MockRequest;

import { GET } from '../route';

describe('Users API Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Parámetros inválidos retornan 400', () => {
    it('page < 1 retorna 400', async () => {
      const request = new Request('http://localhost/api/users?page=0');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('El parámetro page debe ser mayor a 0');
    });

    it('pageSize inválido retorna 400', async () => {
      const request = new Request('http://localhost/api/users?pageSize=15');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('El parámetro pageSize debe ser 5, 10 o 20');
    });

    it('sort inválido retorna 400', async () => {
      const request = new Request('http://localhost/api/users?sort=invalid');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('El parámetro sort debe tener formato campo:direccion (ej: created_at:desc)');
    });
  });

  describe('Paginación devuelve meta.total correcto y items del rango esperado', () => {
    beforeEach(() => {
      // Mock Promise.all para count y data queries
      global.Promise.all = jest.fn().mockResolvedValue([
        { count: 25 }, // count query
        { data: Array(10).fill({ id: 1, name: 'Test', email: 'test@test.com', created_at: '2024-01-01' }), error: null } // data query
      ]);
    });

    it('retorna meta.total correcto', async () => {
      const request = new Request('http://localhost/api/users?page=1&pageSize=10');
      const response = await GET(request);
      const data = await response.json();

      expect(data.meta.total).toBe(25);
      expect(data.meta.totalPages).toBe(3);
      expect(data.meta.page).toBe(1);
      expect(data.meta.pageSize).toBe(10);
    });

    it('retorna items del rango esperado', async () => {
      const request = new Request('http://localhost/api/users?page=2&pageSize=5');
      const response = await GET(request);
      const data = await response.json();

      expect(data.items).toHaveLength(10); // Mock data length
      expect(mockSupabaseQuery.range).toHaveBeenCalledWith(5, 9); // (page-1)*pageSize, offset+limit-1
    });
  });

  describe('Búsqueda por q encuentra por name y email', () => {
    it('aplica filtro ilike en name y email', async () => {
      const request = new Request('http://localhost/api/users?q=maría');
      await GET(request);

      expect(mockSupabaseQuery.or).toHaveBeenCalledWith('name.ilike.%maría%,email.ilike.%maría%');
    });
  });

  describe('Ordenamiento aplica dirección y campo correctos', () => {
    it('aplica created_at:desc por defecto', async () => {
      const request = new Request('http://localhost/api/users');
      await GET(request);

      expect(mockSupabaseQuery.order).toHaveBeenCalledWith('created_at', { ascending: false });
    });

    it('aplica name:asc correctamente', async () => {
      const request = new Request('http://localhost/api/users?sort=name:asc');
      await GET(request);

      expect(mockSupabaseQuery.order).toHaveBeenCalledWith('name', { ascending: true });
    });
  });
});
