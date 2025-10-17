export const API_BASE_URL = "http://localhost:8080";
export const API_KEY = "test-api-key";

export const authStorage = {
  getAccessToken: jest.fn(() => localStorage.getItem("accessToken")),
  getRefreshToken: jest.fn(() => localStorage.getItem("refreshToken")),
  getEmail: jest.fn(() => localStorage.getItem("userEmail")),
  setTokens: jest.fn((access, refresh) => {
    localStorage.setItem("accessToken", access);
    localStorage.setItem("refreshToken", refresh);
  }),
  setEmail: jest.fn((email) => localStorage.setItem("userEmail", email)),
  clear: jest.fn(() => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userEmail");
  }),
};

export const request = jest.fn();

export const refreshAccessToken = jest.fn();