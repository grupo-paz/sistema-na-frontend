import React, { FormEvent, useState } from "react";
import type { Event } from "../../../../services";
import { createEvent, getEvents } from "../../../../services";
import { Loading } from "../../../../components";
import { EVENT_CATEGORIES, EVENT_TYPES } from "../constants";

import "../stylesheets/admin-events.css";

interface EventsFormProps {
    setEvents: (events: Event[]) => void;
    filterFutureEvents: (events: Event[]) => Promise<Event[]>;
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

const EventsForm: React.FC<EventsFormProps> = ({ setEvents, filterFutureEvents }) => {
    const [createForm, setCreateForm] = useState<FormData>({
        title: "",
        description: "",
        dateTime: "",
        location: "",
        type: "",
        category: ""
    });
    const [isCreateFormExpanded, setIsCreateFormExpanded] = useState(false);
    const [createMessage, setCreateMessage] = useState<MessageState>({ error: false, text: "" });
    const [loading, setLoading] = useState(false);

    const resetCreateForm = () => {
        setCreateForm({
            title: "",
            description: "",
            dateTime: "",
            location: "",
            type: "",
            category: ""
        });
        setIsCreateFormExpanded(false);
        setCreateMessage({ error: false, text: "" });
    };

    const validateDateTime = (dateTime: string): boolean => {
        const selectedDate = new Date(dateTime);
        const now = new Date();
        return selectedDate > now;
    };

    const handleCreateSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setCreateMessage({ error: false, text: "" });

        try {
            if (!validateDateTime(createForm.dateTime)) {
                setCreateMessage({ error: true, text: "Não é possível cadastrar eventos no passado. Selecione uma data e hora futura." });
                setLoading(false);
                return;
            }

            const eventData = {
                title: createForm.title,
                description: createForm.description,
                dateTime: new Date(createForm.dateTime).toISOString(),
                location: createForm.location,
                type: createForm.type,
                category: createForm.category,
            };

            await createEvent(eventData);
            setCreateMessage({ error: false, text: "Evento criado com sucesso!" });

            resetCreateForm();
            const updated = await getEvents();
            const futureEvents = await filterFutureEvents(updated);
            setEvents(futureEvents);
        } catch (e: any) {
            setCreateMessage({ error: true, text: e.message || "Erro ao salvar evento." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {loading && <Loading />}
            <div className="events-form-section">
                <div
                    className="form-header clickable"
                    onClick={() => setIsCreateFormExpanded(!isCreateFormExpanded)}
                    aria-expanded={isCreateFormExpanded}
                >
                    <h3>Adicionar Novo Evento</h3>
                    <span className={`expand-icon ${isCreateFormExpanded ? 'expanded' : ''}`}>
                        ▼
                    </span>
                </div>
                {isCreateFormExpanded && (
                    <form onSubmit={handleCreateSubmit} className={`events-form expandable create-form`}>
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="event-title">Título</label>
                                <input
                                    id="event-title"
                                    type="text"
                                    placeholder="Título do evento"
                                    value={createForm.title}
                                    onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="event-category">Categoria</label>
                                <select
                                    id="event-category"
                                    value={createForm.category}
                                    onChange={(e) => setCreateForm({ ...createForm, category: e.target.value })}
                                    required
                                >
                                   {EVENT_CATEGORIES.map(option => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="event-description">Descrição</label>
                            <textarea
                                id="event-description"
                                placeholder="Descrição do evento"
                                value={createForm.description}
                                onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                                rows={3}
                                required
                            />
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="event-datetime">Data e Hora</label>
                                <input
                                    id="event-datetime"
                                    type="datetime-local"
                                    value={createForm.dateTime}
                                    onChange={(e) => setCreateForm({ ...createForm, dateTime: e.target.value })}
                                    min={new Date().toISOString().slice(0, 16)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="event-location">Local</label>
                                <input
                                    id="event-location"
                                    type="text"
                                    placeholder="Local do evento"
                                    value={createForm.location}
                                    onChange={(e) => setCreateForm({ ...createForm, location: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="event-type">Tipo</label>
                            <select
                                id="event-type"
                                value={createForm.type}
                                onChange={(e) => setCreateForm({ ...createForm, type: e.target.value })}
                                required
                            >
                                 {EVENT_TYPES.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="buttons">
                            <button type="submit" disabled={loading} className="submit-btn">
                                {(() => {
                                    if (loading) {
                                        return "Criando...";
                                    }
                                    return "Criar Evento";
                                })()}
                            </button>
                        </div>
                    </form>
                )}
                {createMessage?.text && (
                    <p className={createMessage.error ? "form-message-error" : "form-message-success"}>
                        {createMessage.text}
                    </p>
                )}
            </div>
        </>
    );
};

export default EventsForm;