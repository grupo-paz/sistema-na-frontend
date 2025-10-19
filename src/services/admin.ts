/**
 * Atualiza dados do administrador (nome, email, etc)
 * @param id ID do administrador
 * @param data Objeto parcial com campos a atualizar (name, email, etc)
 * @returns Mensagem de sucesso ou erro
 */
export async function updateAdmin(id: string, data: Partial<Admin>) {
  return request<MessageResponse>(`/admins/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", "x-api-key": API_KEY },
    body: JSON.stringify(data),
  });
}
/**
 * Obtém um administrador pelo ID
 * @param id ID do administrador
 * @returns Objeto Admin
 */
export async function getAdminById(id: string) {
  return request<Admin>(`/admins/${id}`, {
    method: "GET",
    headers: { "x-api-key": API_KEY },
  });
}
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