import { API_KEY, request } from "./base";
import { Meeting, CreateMeetingBody, UpdateMeetingBody, MessageResponse } from "./types";

/**
 * Cria uma nova reunião
 */
export const createMeeting = async (data: CreateMeetingBody): Promise<Meeting> => {
    return request<Meeting>("/meetings", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-api-key": API_KEY },
        body: JSON.stringify(data),
    });
};

/**
 * Lista todas as reuniões
 */
export const getMeetings = async (): Promise<Meeting[]> => {
    return request<Meeting[]>("/meetings", {
        method: "GET",
        headers: { "x-api-key": API_KEY },
    });
};

/**
 * Busca uma reunião específica pelo ID
 */
export const getMeetingById = async (id: string): Promise<Meeting> => {
    return request<Meeting>(`/meetings/${id}`, {
        method: "GET",
        headers: { "x-api-key": API_KEY },
    });
};

/**
 * Atualiza uma reunião existente
 */
export const updateMeeting = async (id: string, data: UpdateMeetingBody): Promise<Meeting> => {
    return request<Meeting>(`/meetings/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "x-api-key": API_KEY },
        body: JSON.stringify(data),
    });
};

/**
 * Remove uma reunião
 */
export const removeMeeting = async (id: string): Promise<MessageResponse> => {
    return request<MessageResponse>(`/meetings/${id}`, {
        method: "DELETE",
        headers: { "x-api-key": API_KEY },
    });
};

/**
 * Busca a reunião de hoje
 */
export const getTodayMeeting = async (): Promise<Meeting | null> => {
    return request<Meeting | null>("/meetings/today", {
        method: "GET",
        headers: { "x-api-key": API_KEY },
    });
};
