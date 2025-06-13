import '@testing-library/jest-dom';

global.fetch = jest.fn();

class MockResponse {
  constructor(body, init = {}) {
    this.body = body;
    this.status = init.status || 200;
    this.statusText = init.statusText || '';
    this.ok = this.status >= 200 && this.status < 300;
    this.headers = {
      get: jest.fn(),
      set: jest.fn(),
      has: jest.fn(),
      delete: jest.fn(),
      append: jest.fn(),
      ...init.headers
    };
  }

  json() {
    return Promise.resolve(this.body);
  }

  text() {
    return Promise.resolve(JSON.stringify(this.body));
  }
}

global.Response = MockResponse;
global.Headers = class Headers {
  constructor() {
    return {
      get: jest.fn(),
      set: jest.fn(),
      has: jest.fn(),
      delete: jest.fn(),
      append: jest.fn()
    };
  }
};

// Create a mock implementation of NextResponse
const NextResponseMock = {
  json: jest.fn().mockImplementation((body, init = {}) => {
    return new MockResponse(body, init);
  })
};

// Mock NextResponse
jest.mock('next/server', () => ({
  NextResponse: NextResponseMock
}));

// Limpiar todos los mocks después de cada prueba
afterEach(() => {
  jest.clearAllMocks();
  NextResponseMock.json.mockClear();
}); 
