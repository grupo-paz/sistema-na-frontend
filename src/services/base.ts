export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
export const API_KEY = import.meta.env.VITE_API_KEY || "";

export const authStorage = {
  getAccessToken: () => localStorage.getItem("accessToken"),
  getRefreshToken: () => localStorage.getItem("refreshToken"),
  getAdminId: () => localStorage.getItem("adminId"),
  setTokens: (access: string, refresh: string) => {
    localStorage.setItem("accessToken", access);
    localStorage.setItem("refreshToken", refresh);
  },
  setAdminId: (adminId: string) => localStorage.setItem("adminId", adminId),
  clear: () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("adminId");
  },
};

export async function request<T>(
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