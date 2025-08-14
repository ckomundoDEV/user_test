import { GET } from '../src/app/api/health/route';

describe('Health API E2E Tests (Mock)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('debería responder con estructura completa del health check', async () => {
    const response = await GET();
    const data = JSON.parse(await response.text());

    expect(response.status).toBe(200);
    expect(data).toEqual({
      status: 'ok',
      timestamp: expect.any(String),
      version: expect.any(String)
    });
    
    // Verificar que el timestamp es una fecha válida ISO
    expect(new Date(data.timestamp).toISOString()).toBe(data.timestamp);
  });

  it('debería manejar errores y devolver status 500', async () => {
    // Mock Date para simular error
    const originalDate = global.Date;
    global.Date = class extends Date {
      constructor() {
        super();
        throw new Error('Simulación de error de sistema');
      }
    } as DateConstructor;

    const response = await GET();
    const data = JSON.parse(await response.text());

    expect(response.status).toBe(500);
    expect(data).toEqual({
      status: 'error',
      message: 'Health check failed: Simulación de error de sistema'
    });

    // Restaurar Date original
    global.Date = originalDate;
  });

  it('debería usar la versión de package.json o default', async () => {
    const originalVersion = process.env.npm_package_version;
    
    // Test con versión personalizada
    process.env.npm_package_version = '2.0.0-test';
    let response = await GET();
    let data = JSON.parse(await response.text());
    expect(data.version).toBe('2.0.0-test');
    
    // Test con versión por defecto
    delete process.env.npm_package_version;
    response = await GET();
    data = JSON.parse(await response.text());
    expect(data.version).toBe('1.0.0');

    // Restaurar versión original
    process.env.npm_package_version = originalVersion;
  });
});
