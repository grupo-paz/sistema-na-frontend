export interface LoginResponse {
  message: string;
  accessToken: string;
  refreshToken: string;
}

export interface RegisterAdminBody {
  name: string;
  email: string;
}

export interface Admin {
  id: string;
  name: string;
  email: string;
}

export interface MessageResponse {
  message: string;
}