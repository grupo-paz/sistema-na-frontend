export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
export const API_KEY = import.meta.env.VITE_API_KEY || "";

export interface LoginResponse {
  message: string;
  accessToken: string;
  refreshToken: string;
}

export interface RegisterAdminBody {
  name: string;
  email: string;
}

async function request<T>(
  path: string,
  options: RequestInit & { skipAuth?: boolean } = {}
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "x-api-key": API_KEY,
    ...(options.headers as any),
  };
  const access = authStorage.getAccessToken();

  if (!options.skipAuth && access) {
    headers["Authorization"] = `Bearer ${access}`;
  }
  const res = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });

  if (res.status === 401) {
    if (!options.skipAuth && authStorage.getRefreshToken()) {
      const refreshed = await refreshAccessToken();

      if (refreshed) {
        return request<T>(path, options);
      }
    }
  }

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Erro HTTP ${res.status}`);
  }
  return res.json();
}

export const authStorage = {
  getAccessToken: () => localStorage.getItem("accessToken"),
  getRefreshToken: () => localStorage.getItem("refreshToken"),
  getEmail: () => localStorage.getItem("userEmail"),
  setTokens: (access: string, refresh: string) => {
    localStorage.setItem("accessToken", access);
    localStorage.setItem("refreshToken", refresh);
  },
  setEmail: (email: string) => localStorage.setItem("userEmail", email),
  clear: () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userEmail");
  },
};

export async function login(email: string, password: string) {
  const data = await request<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
    skipAuth: true,
  });

  authStorage.setTokens(data.accessToken, data.refreshToken);
  authStorage.setEmail(email);
  return data;
}

export async function refreshAccessToken() {
  const refreshToken = authStorage.getRefreshToken();

  if (!refreshToken) return false;
  const res = await fetch(`${API_BASE_URL}/refresh/token`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-api-key": API_KEY },
    body: JSON.stringify({ refreshToken }),
  });

  if (!res.ok) {
    authStorage.clear();
    return false;
  }
  const json = await res.json();

  if (json.accessToken) {
    localStorage.setItem("accessToken", json.accessToken);
    return true;
  }
  return false;
}

export async function registerAdmin(body: RegisterAdminBody) {
  return request<{ message: string }>("/auth/register", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function definePassword(token: string, password: string) {
  return request<{ message: string }>("/admins/define-password", {
    method: "POST",
    body: JSON.stringify({ token, password }),
    skipAuth: true,
  });
}
