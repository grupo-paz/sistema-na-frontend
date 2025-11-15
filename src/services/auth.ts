import { API_KEY, authStorage, request } from "./base";
import { LoginResponse, MessageResponse } from "./types";

/**
 * Realiza login do usuário
 * @param email Email do usuário
 * @param password Senha do usuário
 * @returns Objeto com tokens de acesso e refresh
 */
export async function login(email: string, password: string) {
  const data = await request<LoginResponse>("/auth/login", {
    method: "POST",
    headers: { "x-api-key": API_KEY },
    body: JSON.stringify({ email, password }),
    skipAuth: true,
  });

  authStorage.setTokens(data.accessToken, data.refreshToken);
  authStorage.setAdminId(data.admin.id);
  return data;
}

/**
 * Define uma senha para um administrador recém-criado
 * @param token Token de definição de senha
 * @param password Nova senha do usuário
 * @returns Objeto com mensagem de sucesso
 */
export async function definePassword(token: string, password: string) {
  return request<MessageResponse>("/admins/define-password", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-api-key": API_KEY },
    body: JSON.stringify({ token, password }),
    skipAuth: true,
  });
}

/**
 * Altera a senha de um administrador
 * @param adminId ID do administrador
 * @param currentPassword Senha atual
 * @param newPassword Nova senha
 * @returns Mensagem de sucesso ou erro
 */
export async function changeAdminPassword(adminId: string, currentPassword: string, newPassword: string) {
  return request<MessageResponse>(`/admins/change-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-api-key": API_KEY },
    body: JSON.stringify({ adminId, currentPassword, newPassword }),
  });
}
/**
 * Envia email para recuperar a senha de um administrador
 * @param email Email do administrador
 * @returns Mensagem de sucesso ou erro
 */
export async function forgotAdminPassword(email: string) {
  return request<MessageResponse>(`/auth/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-api-key": API_KEY },
    body: JSON.stringify({ email }),
  });
}

export { refreshAccessToken, authStorage } from './base';

export function isTokenValid(token: string): boolean {
  if (!token) return false;

  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return false; // Token mal formatado
    }

    const payload = JSON.parse(atob(parts[1]));

    const expirationTime = payload.exp * 1000; // Converte para milissegundos
    const now = Date.now();

    // O token é válido se a hora atual for menor que a hora de expiração
    return now < expirationTime;

  } catch (e) {
    // Falha na decodificação (token corrompido)
    console.error("Falha na decodificação do token:", e);
    return false;
  }
}
