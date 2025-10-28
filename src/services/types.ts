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

export interface Event {
  id: string;
  title: string;
  description: string;
  dateTime: string;
  location: string;
  type: string;
  category: string;
  createdAt: string;
  updatedAt: string;
  authorId: string;
  author: {
    name: string;
  };
}

export interface CreateEventBody {
  title: string;
  description: string;
  dateTime: string;
  location: string;
  type: string;
  category: string;
}

export interface UpdateEventBody {
  title?: string;
  description?: string;
  dateTime?: string;
  location?: string;
  type?: string;
  category?: string;
}

export interface Meeting {
  id: string;
  dayOfWeek: string;
  time: string;
  type: string;
  category: string;
  roomOpener: string;
  createdAt: string;
  updatedAt: string;
  authorId: string;
  author?: {
    name: string;
  };
}

export interface CreateMeetingBody {
  dayOfWeek: string;
  time: string;
  type: string;
  category: string;
  roomOpener: string;
}

export interface UpdateMeetingBody {
  dayOfWeek?: string;
  time?: string;
  type?: string;
  category?: string;
  roomOpener?: string;
}

