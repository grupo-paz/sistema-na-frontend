import { Event, CreateEventBody, UpdateEventBody, MessageResponse } from "./types";
import { API_KEY, request } from "./base";

/**
 * Obtém a lista de eventos
 * @returns Array de eventos
 */
export async function getEvents() {
  return request<Event[]>(`/events`, {
    method: "GET",
    headers: { "x-api-key": API_KEY },
  });
}

/**
 * Obtém um evento específico por ID
 * @param id ID do evento
 * @returns Evento
 */
export async function getEvent(id: string) {
  return request<Event>(`/events/${id}`, {
    method: "GET",
    headers: { "x-api-key": API_KEY },
  });
}

/**
 * Cria um novo evento
 * @param data Dados do evento
 * @returns Evento criado
 */
export async function createEvent(data: CreateEventBody) {
  return request<Event>(`/events`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-api-key": API_KEY },
    body: JSON.stringify(data),
  });
}

/**
 * Atualiza um evento
 * @param id ID do evento
 * @param data Dados para atualização
 * @returns Evento atualizado
 */
export async function updateEvent(id: string, data: UpdateEventBody) {
  return request<Event>(`/events/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", "x-api-key": API_KEY },
    body: JSON.stringify(data),
  });
}

/**
 * Remove um evento
 * @param id ID do evento
 * @returns Mensagem de sucesso
 */
export async function removeEvent(id: string) {
  return request<MessageResponse>(`/events/${id}`, {
    method: "DELETE",
    headers: { "x-api-key": API_KEY },
  });
}

/**
 * Busca o próximo evento
 * @returns Próximo evento ou null
 */
export async function getNextEvent() {
  return request<Event | null>(`/events/next`, {
    method: "GET",
    headers: { "x-api-key": API_KEY },
  });
}