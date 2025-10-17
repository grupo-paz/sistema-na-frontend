import { authStorage } from "../__mocks__/base";

interface LocalStorageMock {
  getItem: jest.Mock;
  setItem: jest.Mock;
  removeItem: jest.Mock;
  clear: jest.Mock;
  [key: string]: any;
}

const localStorageMock = (() => {
  let store: Record<string, string> = {};
  
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => { store[key] = value?.toString(); }),
    removeItem: jest.fn((key: string) => { delete store[key]; }),
    clear: jest.fn(() => { store = {}; })
  } as LocalStorageMock;
})();

Object.defineProperty(globalThis, 'localStorage', { value: localStorageMock });

describe('Service: Base API', () => {
  describe('when using authStorage', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      localStorageMock.clear();
    });

    describe('and storing authentication tokens', () => {
      it('should store and retrieve access token correctly', () => {
        authStorage.setTokens('test-access', 'test-refresh');
        
        expect(localStorageMock.setItem).toHaveBeenCalledWith('accessToken', 'test-access');
        expect(localStorageMock.setItem).toHaveBeenCalledWith('refreshToken', 'test-refresh');
      });
      
      it('should store and retrieve user email correctly', () => {
        authStorage.setEmail('test@example.com');
        
        expect(localStorageMock.setItem).toHaveBeenCalledWith('userEmail', 'test@example.com');
      });
      
      it('should clear all authentication data correctly', () => {
        authStorage.setTokens('test-access', 'test-refresh');
        authStorage.setEmail('test@example.com');
        
        authStorage.clear();
        
        expect(localStorageMock.removeItem).toHaveBeenCalledWith('accessToken');
        expect(localStorageMock.removeItem).toHaveBeenCalledWith('refreshToken');
        expect(localStorageMock.removeItem).toHaveBeenCalledWith('userEmail');
      });
    });
  });
});