// admin.ts - Serviço relacionado aos administradores

import { API_KEY, request } from "./base";
import { Admin, MessageResponse, RegisterAdminBody } from "./types";

/**
 * Registra um novo administrador no sistema
 * @param body Dados do administrador (nome e email)
 * @returns Objeto com mensagem de sucesso
 */
export async function registerAdmin(body: RegisterAdminBody) {
  return request<MessageResponse>("/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-api-key": API_KEY },
    body: JSON.stringify(body),
  });
}

/**
 * Obtém a lista de todos os administradores
 * @returns Array com todos os administradores cadastrados
 */
export async function getAdmins() {
  return request<Admin[]>("/admins", {
    method: "GET",
    headers: { "x-api-key": API_KEY },
  });
}

/**
 * Remove um administrador pelo ID
 * @param id ID do administrador a ser removido
 * @returns Objeto de resposta da API
 */
export async function removeAdmin(id: string) {
  return request<{ id: string }[]>("/admins/" + id, {
    method: "DELETE",
    headers: { "x-api-key": API_KEY }
  });
}