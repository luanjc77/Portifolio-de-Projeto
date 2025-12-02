// Setup para testes Jest
require('dotenv').config({ path: '.env.test' });

// Mock do pool do PostgreSQL para evitar conexão real durante testes
jest.mock('./db', () => {
  const mockPool = {
    query: jest.fn(),
    connect: jest.fn(),
    end: jest.fn()
  };
  
  return mockPool;
});
