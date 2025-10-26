import { Secretary, UpdateSecretaryBody } from "./types";
import { API_KEY, request } from "./base";

/**
 * Obtém os dados da secretaria
 * @returns Objeto Secretary
 */
export async function getSecretary() {
  return request<Secretary>(`/secretariat`, {
    method: "GET",
    headers: { "x-api-key": API_KEY },
  });
}

/**
 * Atualiza os dados da secretaria
 * @param data Dados atualizados da secretaria
 * @returns Mensagem de sucesso ou erro
 */
export async function updateSecretary(data: UpdateSecretaryBody) {
  return request<any>(`/secretariat`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-api-key": API_KEY },
    body: JSON.stringify(data),
  });
}