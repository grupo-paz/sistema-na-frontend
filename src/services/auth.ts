import { API_KEY, authStorage, request } from "./base";
import { LoginResponse, MessageResponse } from "./types";

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

export async function definePassword(token: string, password: string) {
  return request<MessageResponse>("/admins/define-password", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-api-key": API_KEY },
    body: JSON.stringify({ token, password }),
    skipAuth: true,
  });
}

export async function changeAdminPassword(adminId: string, currentPassword: string, newPassword: string) {
  return request<MessageResponse>(`/admins/change-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-api-key": API_KEY },
    body: JSON.stringify({ adminId, currentPassword, newPassword }),
  });
}

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

  function urlBase64Decode(str: string): string {
    let output = str.replace(/-/g, '+').replace(/_/g, '/');
    while (output.length % 4) {
      output += '=';
    }
    try {
      const binaryString = atob(output);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const decoder = new TextDecoder('utf-8');
      return decoder.decode(bytes);

    } catch (e) {
      console.error("Erro ao decodificar token Base64Url:", e);
      return '';
    }
  }

  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return false;
    }

    const decodedPayload = urlBase64Decode(parts[1]);
    if (!decodedPayload) {
      return false;
    }

    const payload = JSON.parse(decodedPayload);

    const expirationTime = payload.exp * 1000;
    const now = Date.now();

    return now < expirationTime;

  } catch (e) {
    console.error("Falha na decodificação ou JSON inválido do token:", e);
    return false;
  }
}