import { registerAdmin, getAdmins, removeAdmin } from "../admin";
import * as base from "../__mocks__/base";
import { Admin, MessageResponse, RegisterAdminBody } from "../types";

jest.mock("../base", () => jest.requireActual("../__mocks__/base"));

describe('Service: Admin Management', () => {
  describe('when registering a new admin', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    describe('and provided data is valid', () => {
      it('should call API with correct parameters', async () => {
        const adminData: RegisterAdminBody = { name: "Test Admin", email: "admin@example.com" };
        const mockResponse: MessageResponse = { message: "Administrador registrado com sucesso" };
        
        (base.request as jest.Mock).mockResolvedValue(mockResponse);
        
        const result = await registerAdmin(adminData);
        
        expect(base.request).toHaveBeenCalledWith(
          "/auth/register",
          expect.objectContaining({
            method: "POST",
            body: JSON.stringify(adminData)
          })
        );
        
        expect(result).toEqual(mockResponse);
      });
    });

    describe('and provided data is invalid', () => {
      it('should propagate API error', async () => {
        const adminData: RegisterAdminBody = { name: "Test Admin", email: "invalid-email" };
        const errorMessage = "Email inválido";
        
        (base.request as jest.Mock).mockRejectedValue(new Error(errorMessage));
        
        await expect(registerAdmin(adminData)).rejects.toThrow(errorMessage);
      });
    });
  });

  describe('when fetching admin list', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    describe('and request is successful', () => {
      it('should return list of administrators', async () => {
        const mockAdmins: Admin[] = [
          { id: "1", name: "Admin 1", email: "admin1@example.com" },
          { id: "2", name: "Admin 2", email: "admin2@example.com" }
        ];
        
        (base.request as jest.Mock).mockResolvedValue(mockAdmins);
        
        const result = await getAdmins();
        
        expect(base.request).toHaveBeenCalledWith(
          "/admins",
          expect.objectContaining({
            method: "GET",
            headers: expect.objectContaining({ "x-api-key": "test-api-key" })
          })
        );
        
        expect(result).toEqual(mockAdmins);
        expect(result.length).toBe(2);
      });
    });

    describe('and request fails', () => {
      it('should propagate API error', async () => {
        const errorMessage = "Erro ao buscar administradores";
        
        (base.request as jest.Mock).mockRejectedValue(new Error(errorMessage));
        
        await expect(getAdmins()).rejects.toThrow(errorMessage);
      });
    });
  });

  describe('when removing an admin', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    describe('and admin ID is valid', () => {
      it('should call API with correct parameters', async () => {
        const adminId = "123";
        const mockResponse = [{ id: adminId }];
        
        (base.request as jest.Mock).mockResolvedValue(mockResponse);
        
        const result = await removeAdmin(adminId);
        
        expect(base.request).toHaveBeenCalledWith(
          `/admins/${adminId}`,
          expect.objectContaining({
            method: "DELETE",
            headers: expect.objectContaining({ "x-api-key": "test-api-key" })
          })
        );
        
        expect(result).toEqual(mockResponse);
      });
    });

    describe('and admin ID is invalid', () => {
      it('should propagate API error', async () => {
        const errorMessage = "Administrador não encontrado";
        
        (base.request as jest.Mock).mockRejectedValue(new Error(errorMessage));
        
        await expect(removeAdmin("invalid-id")).rejects.toThrow(errorMessage);
      });
    });
  });
});