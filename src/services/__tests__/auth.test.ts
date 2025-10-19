import { login, definePassword } from "../auth";
import * as base from "../__mocks__/base";
import { LoginResponse, MessageResponse } from "../types";

jest.mock("../base", () => jest.requireActual("../__mocks__/base"));

describe('Service: Authentication', () => {
  describe('when using login function', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    describe('and credentials are valid', () => {
      it('should call API with correct parameters', async () => {
        const mockLoginResponse: LoginResponse = { 
          message: "Login bem-sucedido", 
          accessToken: "test-access-token", 
          refreshToken: "test-refresh-token",
          admin: { id: "admin-123", name: "Test Admin", email: "test@example.com" }
        };
        
        (base.request as jest.Mock).mockResolvedValue(mockLoginResponse);
        
        const result = await login("test@example.com", "password123");
        
        expect(base.request).toHaveBeenCalledWith(
          "/auth/login",
          expect.objectContaining({
            method: "POST",
            body: JSON.stringify({ email: "test@example.com", password: "password123" }),
            skipAuth: true
          })
        );
        
        expect(result).toEqual(mockLoginResponse);
      });
      
      it('should store tokens and email on successful login', async () => {
        const mockLoginResponse: LoginResponse = { 
          message: "Login bem-sucedido", 
          accessToken: "test-access-token", 
          refreshToken: "test-refresh-token" ,
          admin: { id: "admin-123", name: "Test Admin", email: "aaa@test.com" }
        };
        
        (base.request as jest.Mock).mockResolvedValue(mockLoginResponse);
        
        await login("test@example.com", "password123");
        
        expect(base.authStorage.setTokens).toHaveBeenCalledWith(
          "test-access-token", 
          "test-refresh-token"
        );

        expect(base.authStorage.setAdminId).toHaveBeenCalledWith("admin-123");
      });
    });

    describe('and credentials are invalid', () => {
      it('should propagate API error', async () => {
        const errorMessage = "Credenciais inválidas";
        (base.request as jest.Mock).mockRejectedValue(new Error(errorMessage));
        
        await expect(login("test@example.com", "wrong-password")).rejects.toThrow(errorMessage);
      });
    });
  });

  describe('when using definePassword function', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    describe('and token is valid', () => {
      it('should call API with correct parameters', async () => {
        const mockResponse: MessageResponse = { message: "Senha definida com sucesso" };
        (base.request as jest.Mock).mockResolvedValue(mockResponse);
        
        const token = "valid-reset-token";
        const password = "new-password123";
        
        const result = await definePassword(token, password);
        
        expect(base.request).toHaveBeenCalledWith(
          "/admins/define-password",
          expect.objectContaining({
            method: "POST",
            body: JSON.stringify({ token, password }),
            skipAuth: true
          })
        );
        
        expect(result).toEqual(mockResponse);
      });
    });

    describe('and token is invalid', () => {
      it('should propagate API error', async () => {
        const errorMessage = "Token inválido ou expirado";
        (base.request as jest.Mock).mockRejectedValue(new Error(errorMessage));
        
        await expect(definePassword("invalid-token", "new-password")).rejects.toThrow(errorMessage);
      });
    });
  });
});