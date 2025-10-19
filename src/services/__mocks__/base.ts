export const API_BASE_URL = "http://localhost:8080";
export const API_KEY = "test-api-key";

export const authStorage = {
  getAccessToken: jest.fn(() => localStorage.getItem("accessToken")),
  getRefreshToken: jest.fn(() => localStorage.getItem("refreshToken")),
  getAdminId: jest.fn(() => localStorage.getItem("adminId")),
  setTokens: jest.fn((access, refresh) => {
    localStorage.setItem("accessToken", access);
    localStorage.setItem("refreshToken", refresh);
  }),
  setAdminId: jest.fn((id) => localStorage.setItem("adminId", id)),
  clear: jest.fn(() => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("adminId");
  }),
};

export const request = jest.fn();

export const refreshAccessToken = jest.fn();