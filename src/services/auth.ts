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
  authStorage.setEmail(email);
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

// Re-exporta função de refresh e authStorage para uso externo
export { refreshAccessToken, authStorage } from './base';