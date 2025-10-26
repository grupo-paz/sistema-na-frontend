export interface LoginResponse {
  message: string;
  accessToken: string;
  refreshToken: string;
  admin: Admin;
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

export interface Secretary {
  cashValue: number;
  pixValue: number;
  createdAt: string;
  author: Admin;
}

export interface UpdateSecretaryBody {
  cashValue: number;
  pixValue: number;
}