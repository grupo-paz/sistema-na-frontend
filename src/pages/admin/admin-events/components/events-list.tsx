import React, { FormEvent, useState } from "react";
import type { Event } from "../../../../services";
import { updateEvent, getEvents, formatDate } from "../../../../services";
import { Loading } from "../../../../components";

import "../stylesheets/admin-events.css";


interface EventsListProps {
    events: Event[];
    setEvents: (events: Event[]) => void;
    filterFutureEvents: (events: Event[]) => Promise<Event[]>;
    onConfirmDelete: (eventId: string) => void;
}

interface FormData {
    title: string;
    description: string;
    dateTime: string;
    location: string;
    type: string;
    category: string;
}

interface MessageState {
    error: boolean;
    text: string;
}

const EventsList: React.FC<EventsListProps> = ({ events, setEvents, filterFutureEvents, onConfirmDelete }) => {
    const [editingEventId, setEditingEventId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<FormData>({
        title: "",
        description: "",
        dateTime: "",
        location: "",
        type: "",
        category: ""
    });
    const [editMessage, setEditMessage] = useState<MessageState>({ error: false, text: "" });
    const [loading, setLoading] = useState(false);

    const resetEditForm = () => {
        setEditingEventId(null);
        setEditForm({
            title: "",
            description: "",
            dateTime: "",
            location: "",
            type: "",
            category: ""
        });
        setEditMessage({ error: false, text: "" });
    };

    const validateDateTime = (dateTime: string): boolean => {
        const selectedDate = new Date(dateTime);
        const now = new Date();
        return selectedDate > now;
    };

    const handleEdit = (event: Event) => {
        setEditingEventId(event.id);
        setEditForm({
            title: event.title,
            description: event.description,
            dateTime: event.dateTime.slice(0, 16),
            location: event.location,
            type: event.type,
            category: event.category
        });
        setEditMessage({ error: false, text: "" });
    };

    const handleEditSubmit = async (e: FormEvent, eventId: string) => {
        e.preventDefault();
        setLoading(true);
        setEditMessage({ error: false, text: "" });

        try {
            if (!validateDateTime(editForm.dateTime)) {
                setEditMessage({
                    error: true,
                    text: "Não é possível cadastrar eventos no passado. Selecione uma data e hora futura."
                });
                setLoading(false);
                return;
            }

            const eventData = {
                title: editForm.title,
                description: editForm.description,
                dateTime: new Date(editForm.dateTime).toISOString(),
                location: editForm.location,
                type: editForm.type,
                category: editForm.category,
            };

            await updateEvent(eventId, eventData);
            setEditMessage({ error: false, text: "Evento atualizado com sucesso!" });

            setTimeout(() => {
                resetEditForm();
            }, 2000);

            const updated = await getEvents();
            const futureEvents = await filterFutureEvents(updated);
            setEvents(futureEvents);
        } catch (e: any) {
            setEditMessage({ error: true, text: e.message || "Erro ao atualizar evento." });
        } finally {
            setLoading(false);
        }
    };

    const handleCancelEdit = () => {
        resetEditForm();
    };

    const groupEventsByMonth = (events: Event[]): Array<{ key: string; label: string; events: Event[] }> => {
        const grouped: Record<string, Event[]> = {};

        for (const event of events) {
            const date = new Date(event.dateTime);
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

            if (!grouped[monthKey]) {
                grouped[monthKey] = [];
            }
            grouped[monthKey].push(event);
        }

        // Ordenar eventos dentro de cada mês por data
        for (const monthKey of Object.keys(grouped)) {
            grouped[monthKey].sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());
        }

        // Converter para array e ordenar por data
        return Object.keys(grouped)
            .sort((a, b) => a.localeCompare(b))
            .map(key => {
                const firstEvent = grouped[key][0];
                const date = new Date(firstEvent.dateTime);
                const label = `${date.toLocaleDateString('pt-BR', {
                    month: 'long'
                }).charAt(0).toUpperCase() + date.toLocaleDateString('pt-BR', {
                    month: 'long'
                }).slice(1)}/${date.getFullYear()}`;
                
                return {
                    key,
                    label,
                    events: grouped[key]
                };
            });
    };

    const handleInlineEdit = async (eventId: string) => {
        // Validar formulário manualmente
        if (!editForm.title || !editForm.description || !editForm.dateTime || 
            !editForm.location || !editForm.type || !editForm.category) {
            setEditMessage({ error: true, text: "Todos os campos são obrigatórios." });
            return;
        }
        
        // Criar um evento sintético para o formulário
        const syntheticEvent = {
            preventDefault: () => {}
        } as unknown as FormEvent;
        
        await handleEditSubmit(syntheticEvent, eventId);
    };

    const cancelInlineEdit = () => {
        handleCancelEdit();
    };

    const groupedEvents = groupEventsByMonth(events);

    if (events.length === 0) {
        return (
            <div className="events-list-section">
                <h3>Lista de Eventos</h3>
                <p className="no-events">Nenhum evento cadastrado ainda.</p>
            </div>
        );
    }

    return (
        <>
            {loading && <Loading />}

            <div className="events-list-section">
                <h2>Eventos Cadastrados</h2>
                {events.length === 0 && !loading && <p className="no-events">Nenhum evento cadastrado.</p>}
                {groupedEvents.map((monthGroup) => (
                    <div key={monthGroup.key} className="month-group">
                        <span className="month-title">{monthGroup.label}</span>
                        <ul className="events-list">
                            {monthGroup.events.map((event) => (
                                <li key={event.id} className="event-card">
                                    {editingEventId === event.id ? (
                                        <div className="inline-edit-form">
                                            <div className="form-row">
                                                <div className="form-group">
                                                    <label htmlFor={`edit-title-${event.id}`}>Título</label>
                                                    <input
                                                        id={`edit-title-${event.id}`}
                                                        type="text"
                                                        value={editForm.title}
                                                        onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                                                        required
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor={`edit-category-${event.id}`}>Categoria</label>
                                                    <select
                                                        id={`edit-category-${event.id}`}
                                                        value={editForm.category}
                                                        onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                                                        required
                                                    >
                                                        <option value="">Selecione uma categoria</option>
                                                        <option value="Acadêmico">Acadêmico</option>
                                                        <option value="Cultural">Cultural</option>
                                                        <option value="Esportivo">Esportivo</option>
                                                        <option value="Palestra">Palestra</option>
                                                        <option value="Workshop">Workshop</option>
                                                        <option value="Reunião">Reunião</option>
                                                        <option value="Outro">Outro</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor={`edit-description-${event.id}`}>Descrição</label>
                                                <textarea
                                                    id={`edit-description-${event.id}`}
                                                    value={editForm.description}
                                                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                                    rows={3}
                                                    required
                                                />
                                            </div>
                                            <div className="form-row">
                                                <div className="form-group">
                                                    <label htmlFor={`edit-datetime-${event.id}`}>Data e Hora</label>
                                                    <input
                                                        id={`edit-datetime-${event.id}`}
                                                        type="datetime-local"
                                                        value={editForm.dateTime}
                                                        onChange={(e) => setEditForm({ ...editForm, dateTime: e.target.value })}
                                                        min={new Date().toISOString().slice(0, 16)}
                                                        required
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor={`edit-location-${event.id}`}>Local</label>
                                                    <input
                                                        id={`edit-location-${event.id}`}
                                                        type="text"
                                                        value={editForm.location}
                                                        onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor={`edit-type-${event.id}`}>Tipo</label>
                                                <select
                                                    id={`edit-type-${event.id}`}
                                                    value={editForm.type}
                                                    onChange={(e) => setEditForm({ ...editForm, type: e.target.value })}
                                                    required
                                                >
                                                    <option value="">Selecione um tipo</option>
                                                    <option value="Presencial">Presencial</option>
                                                    <option value="Online">Online</option>
                                                    <option value="Híbrido">Híbrido</option>
                                                </select>
                                            </div>
                                            <div className="buttons">
                                                <button
                                                    type="button"
                                                    onClick={() => handleInlineEdit(event.id)}
                                                    disabled={loading}
                                                    className="submit-btn"
                                                >
                                                    {loading ? "Salvando..." : "Salvar"}
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={cancelInlineEdit}
                                                    disabled={loading}
                                                    className="cancel-btn"
                                                >
                                                    Cancelar
                                                </button>
                                            </div>
                                            {editMessage?.text && (
                                                <p className={editMessage.error ? "form-message-error" : "form-message-success"}>
                                                    {editMessage.text}
                                                </p>
                                            )}
                                        </div>
                                    ) : (
                                        // Visualização normal do evento
                                        <>
                                            <div className="event-info">
                                                <div className="event-header">
                                                    <span className="event-title">{event.title}</span>
                                                    <span className="event-category">{event.category}</span>
                                                </div>
                                                <span className="event-description">{event.description}</span>
                                                <div className="event-details">
                                                    <span className="event-datetime">{formatDate(event.dateTime)}</span>
                                                    <span className="event-location">{event.location}</span>
                                                    <span className="event-type">{event.type}</span>
                                                </div>
                                                <span className="event-author">Por: {event.author.name}</span>
                                            </div>
                                            <div className="event-actions">
                                                <button
                                                    className="event-action-btn edit-btn"
                                                    title="Editar"
                                                    onClick={() => handleEdit(event)}
                                                >
                                                    <svg viewBox="0 0 24 24">
                                                        <path d="M3 17.46v3.04c0 .28.22.5.5.5h3.04c.13 0 .26-.05.35-.15L17.81 9.94l-3.75-3.75L3.15 17.1c-.1.1-.15.22-.15.36zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                                                    </svg>
                                                </button>
                                                <button
                                                    className="event-action-btn delete-btn"
                                                    title="Remover"
                                                    onClick={() => onConfirmDelete(event.id)}
                                                >
                                                    <svg viewBox="0 0 24 24">
                                                        <rect x="4" y="4" width="16" height="2" rx="1" fill="white"></rect>
                                                <path d="M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6zm3.46-8.12a1 1 0 0 1 1.41 0L12 11.59l1.12-1.12a1 1 0 1 1 1.41 1.41L13.41 13l1.12 1.12a1 1 0 0 1-1.41 1.41L12 14.41l-1.12 1.12a1 1 0 0 1-1.41-1.41L10.59 13l-1.12-1.12a1 1 0 0 1 0-1.41z" />                                                    </svg>
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

        </>
    );
};

export default EventsList;