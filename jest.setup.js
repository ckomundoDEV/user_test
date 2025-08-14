import { TextEncoder, TextDecoder } from 'util';

// Polyfills para Node.js
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Mock fetch
global.fetch = jest.fn();

// Polyfill para Request y Response
class MockRequest {
  constructor(url, init) {
    this.url = url;
    this.method = init?.method || 'GET';
    this.headers = init?.headers || {};
    this.body = init?.body;

    const urlObj = new URL(url);
    this.searchParams = urlObj.searchParams;
  }

  json() {
    return Promise.resolve(JSON.parse(this.body || '{}'));
  }
}

global.Request = MockRequest;

if (typeof window !== 'undefined') {
  window.Request = MockRequest;
}

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
      ...init.headers,
    };
  }

  json() {
    return Promise.resolve(this.body);
  }

  text() {
    return Promise.resolve(JSON.stringify(this.body));
  }

  static json(data, init = {}) {
    return new MockResponse(data, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        ...init?.headers,
      },
    });
  }
}

global.Response = MockResponse;
// Asegurarse que el método estático json esté disponible
Response.json = MockResponse.json;

global.Headers = class Headers {
  constructor() {
    return {
      get: jest.fn(),
      set: jest.fn(),
      has: jest.fn(),
      delete: jest.fn(),
      append: jest.fn(),
    };
  }
};

// Create a mock implementation of NextResponse
const NextResponseMock = {
  json: jest.fn().mockImplementation((body, init = {}) => {
    return new MockResponse(body, init);
  }),
};

// Mock NextResponse
jest.mock('next/server', () => ({
  NextResponse: NextResponseMock,
}));

// Limpiar todos los mocks después de cada prueba
afterEach(() => {
  jest.clearAllMocks();
  NextResponseMock.json.mockClear();
});
