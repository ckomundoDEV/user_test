import { GET } from '../route';

describe('Health Check Endpoint', () => {
  // Guardar la implementación original de Date
  const originalDate = global.Date;

  beforeEach(() => {
    // Limpiar todos los mocks antes de cada prueba
    jest.clearAllMocks();
    // Restaurar Date original antes de cada test
    global.Date = originalDate;
  });

  afterAll(() => {
    // Restaurar la implementación original de Date después de todas las pruebas
    global.Date = originalDate;
  });

  it('debería retornar 200 y la estructura correcta de respuesta', async () => {
    // Mock de la fecha para tener una respuesta consistente
    const mockDate = new Date('2024-03-20T12:00:00.000Z');
    global.Date = class extends Date {
      constructor() {
        super();
        return mockDate;
      }
    } as DateConstructor;

    const response = await GET();
    const data = JSON.parse(await response.text());

    expect(response.status).toBe(200);
    expect(data).toEqual({
      status: 'ok',
      timestamp: '2024-03-20T12:00:00.000Z',
      version: expect.any(String)
    });
  });

  it('debería manejar errores de manera elegante', async () => {
    // Simular un error en la creación de la fecha
    global.Date = class extends Date {
      constructor() {
        super();
        throw new Error('Error simulado en Date');
      }
    } as DateConstructor;

    const response = await GET();
    const data = JSON.parse(await response.text());

    expect(response.status).toBe(500);
    expect(data).toEqual({
      status: 'error',
      message: 'Health check failed: Error simulado en Date'
    });
  });

  it('debería incluir la versión del paquete en la respuesta', async () => {
    // Mock de process.env.npm_package_version
    const originalVersion = process.env.npm_package_version;
    process.env.npm_package_version = '1.0.0-test';

    const response = await GET();
    const data = JSON.parse(await response.text());

    expect(data.version).toBe('1.0.0-test');

    // Restaurar la versión original
    process.env.npm_package_version = originalVersion;
  });

  it('debería usar la versión por defecto cuando npm_package_version no está definida', async () => {
    // Eliminar temporalmente npm_package_version
    const originalVersion = process.env.npm_package_version;
    delete process.env.npm_package_version;

    const response = await GET();
    const data = JSON.parse(await response.text());

    expect(data.version).toBe('1.0.0');

    // Restaurar la versión original"
    process.env.npm_package_version = originalVersion;
  });
}); 