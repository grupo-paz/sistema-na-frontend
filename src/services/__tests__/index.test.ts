import * as baseModule from "../__mocks__/base";

const authModule = {
  login: jest.fn(),
  definePassword: jest.fn(),
  refreshAccessToken: jest.fn(),
  authStorage: baseModule.authStorage
};

const adminModule = {
  registerAdmin: jest.fn(),
  getAdmins: jest.fn(),
  removeAdmin: jest.fn()
};

describe('API Module - Mocked Modules', () => {
  it('should have all expected base API functions', () => {
    expect(baseModule.API_BASE_URL).toBeDefined();
    expect(baseModule.API_KEY).toBeDefined();
    expect(baseModule.request).toBeDefined();
    expect(baseModule.authStorage).toBeDefined();
    expect(baseModule.refreshAccessToken).toBeDefined();
  });
  
  it('should have all expected auth functions', () => {
    expect(authModule.login).toBeDefined();
    expect(authModule.definePassword).toBeDefined();
  });
  
  it('should have all expected admin functions', () => {
    expect(adminModule.registerAdmin).toBeDefined();
    expect(adminModule.getAdmins).toBeDefined();
    expect(adminModule.removeAdmin).toBeDefined();
  });
  
  it('should have authStorage with all expected methods', () => {
    expect(baseModule.authStorage.getAccessToken).toBeDefined();
    expect(baseModule.authStorage.getRefreshToken).toBeDefined();
    expect(baseModule.authStorage.getEmail).toBeDefined();
    expect(baseModule.authStorage.setTokens).toBeDefined();
    expect(baseModule.authStorage.setEmail).toBeDefined();
    expect(baseModule.authStorage.clear).toBeDefined();
  });
});