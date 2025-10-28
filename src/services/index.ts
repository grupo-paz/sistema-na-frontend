export { API_BASE_URL, API_KEY, request, authStorage, refreshAccessToken } from "./base";

export { login, definePassword } from "./auth";

export { registerAdmin, getAdmins, removeAdmin } from "./admin";

export type { 
  LoginResponse, 
  RegisterAdminBody, 
  Admin, 
  MessageResponse 
} from "./types";

export { getSecretary, updateSecretary } from "./secretary";

export { getEvents, getEvent, createEvent, updateEvent, removeEvent } from "./events";

export { createMeeting, getMeetings, getMeetingById, updateMeeting, removeMeeting } from "./meetings";

export type { 
  Secretary, 
  UpdateSecretaryBody,
  Event,
  CreateEventBody,
  UpdateEventBody,
  Meeting,
  CreateMeetingBody,
  UpdateMeetingBody
} from "./types";

export * from "./utils";