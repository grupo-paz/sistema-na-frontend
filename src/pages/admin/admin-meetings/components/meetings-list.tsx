import React, { FormEvent, useState } from "react";
import type { Meeting } from "../../../../services";
import { updateMeeting, getMeetings } from "../../../../services";
import { Loading } from "../../../../components";
import { MEETING_CATEGORIES, MEETING_TYPES, DAYS_OF_WEEK } from "../constants";

import "../stylesheets/admin-meetings.css";


interface MeetingsListProps {
    meetings: Meeting[];
    setMeetings: (meetings: Meeting[]) => void;
    onConfirmDelete: (meetingId: string) => void;
}

interface FormData {
    dayOfWeek: string;
    time: string;
    type: string;
    category: string;
    roomOpener: string;
}

interface MessageState {
    error: boolean;
    text: string;
}

const MeetingsList: React.FC<MeetingsListProps> = ({ meetings, setMeetings, onConfirmDelete }) => {
    const [editingMeetingId, setEditingMeetingId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<FormData>({
        dayOfWeek: "",
        time: "",
        type: "",
        category: "",
        roomOpener: ""
    });
    const [editMessage, setEditMessage] = useState<MessageState>({ error: false, text: "" });
    const [loading, setLoading] = useState(false);

    const resetEditForm = () => {
        setEditingMeetingId(null);
        setEditForm({
            dayOfWeek: "",
            time: "",
            type: "",
            category: "",
            roomOpener: ""
        });
        setEditMessage({ error: false, text: "" });
    };

    const validateTime = (time: string): boolean => {
        // Validar formato HH:MM
        const timeRegex = /^([0-1]?\d|2[0-3]):[0-5]\d$/;
        return timeRegex.test(time);
    };

    const handleEdit = (meeting: Meeting) => {
        setEditingMeetingId(meeting.id);
        setEditForm({
            dayOfWeek: meeting.dayOfWeek,
            time: meeting.time,
            type: meeting.type,
            category: meeting.category,
            roomOpener: meeting.roomOpener
        });
        setEditMessage({ error: false, text: "" });
    };

    const handleEditSubmit = async (e: FormEvent, meetingId: string) => {
        e.preventDefault();
        setLoading(true);
        setEditMessage({ error: false, text: "" });

        try {
            if (!validateTime(editForm.time)) {
                setEditMessage({
                    error: true,
                    text: "Formato de horário inválido. Use HH:MM (ex: 14:30)."
                });
                setLoading(false);
                return;
            }

            const meetingData = {
                dayOfWeek: editForm.dayOfWeek,
                time: editForm.time,
                type: editForm.type,
                category: editForm.category,
                roomOpener: editForm.roomOpener,
            };

            await updateMeeting(meetingId, meetingData);
            setEditMessage({ error: false, text: "Reunião atualizada com sucesso!" });

            setTimeout(() => {
                resetEditForm();
            }, 2000);

            const updated = await getMeetings();
            setMeetings(updated);
        } catch (e: any) {
            setEditMessage({ error: true, text: e.message || "Erro ao atualizar reunião." });
        } finally {
            setLoading(false);
        }
    };

    const handleCancelEdit = () => {
        resetEditForm();
    };

    const handleInlineEdit = async (meetingId: string) => {
        // Validar formulário manualmente
        if (!editForm.dayOfWeek || !editForm.time || !editForm.type ||
            !editForm.category || !editForm.roomOpener) {
            setEditMessage({ error: true, text: "Todos os campos são obrigatórios." });
            return;
        }

        // Criar um evento sintético para o formulário
        const syntheticEvent = {
            preventDefault: () => { }
        } as unknown as FormEvent;

        await handleEditSubmit(syntheticEvent, meetingId);
    };

    const cancelInlineEdit = () => {
        handleCancelEdit();
    };

    if (meetings.length === 0) {
        return (
            <div className="meetings-list-section">
                <h3>Lista de Reuniões</h3>
                <p className="no-meetings">Nenhuma reunião cadastrada ainda.</p>
            </div>
        );
    }

    return (
        <>
            {loading && <Loading />}

            <div className="meetings-list-section">
                <h2>Reuniões Cadastradas</h2>
                {meetings.length === 0 && !loading && <p className="no-meetings">Nenhuma reunião cadastrada.</p>}
                <ul className="meetings-list">
                    {meetings.map((meeting) => (
                        <li key={meeting.id} className="meeting-card">
                            {editingMeetingId === meeting.id ? (
                                <div className="inline-edit-form">
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label htmlFor={`edit-dayOfWeek-${meeting.id}`}>Dia da Semana</label>
                                            <select
                                                id={`edit-dayOfWeek-${meeting.id}`}
                                                value={editForm.dayOfWeek}
                                                onChange={(e) => setEditForm({ ...editForm, dayOfWeek: e.target.value })}
                                                required
                                            >
                                                {DAYS_OF_WEEK.map(option => (
                                                    <option key={option.value} value={option.value}>
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor={`edit-time-${meeting.id}`}>Horário</label>
                                            <input
                                                id={`edit-time-${meeting.id}`}
                                                type="time"
                                                value={editForm.time}
                                                onChange={(e) => setEditForm({ ...editForm, time: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label htmlFor={`edit-category-${meeting.id}`}>Categoria</label>
                                            <select
                                                id={`edit-category-${meeting.id}`}
                                                value={editForm.category}
                                                onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                                                required
                                            >
                                                {MEETING_CATEGORIES.map(option => (
                                                    <option key={option.value} value={option.value}>
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor={`edit-type-${meeting.id}`}>Tipo</label>
                                            <select
                                                id={`edit-type-${meeting.id}`}
                                                value={editForm.type}
                                                onChange={(e) => setEditForm({ ...editForm, type: e.target.value })}
                                                required
                                            >
                                                {MEETING_TYPES.map(option => (
                                                    <option key={option.value} value={option.value}>
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor={`edit-roomOpener-${meeting.id}`}>Responsável por Abrir a Sala</label>
                                        <input
                                            id={`edit-roomOpener-${meeting.id}`}
                                            type="text"
                                            value={editForm.roomOpener}
                                            onChange={(e) => setEditForm({ ...editForm, roomOpener: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="buttons">
                                        <button
                                            type="button"
                                            onClick={() => handleInlineEdit(meeting.id)}
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
                                <>
                                    <div className="meeting-info">
                                        <div className="meeting-header">
                                            <h3>{meeting.dayOfWeek} - {meeting.time}</h3>
                                            <span className="meeting-category">{meeting.category}</span>
                                        </div>
                                        <div className="meeting-details">
                                            <span className="meeting-type">{meeting.type}</span>
                                            <span className="meeting-room-opener">Responsável por abrir: {meeting.roomOpener}</span>
                                        </div>
                                    </div>
                                    <div className="meeting-actions">
                                        <button
                                            className="meeting-action-btn edit-btn"
                                            title="Editar"
                                            onClick={() => handleEdit(meeting)}
                                        >
                                            <svg viewBox="0 0 24 24">
                                                <path d="M3 17.46v3.04c0 .28.22.5.5.5h3.04c.13 0 .26-.05.35-.15L17.81 9.94l-3.75-3.75L3.15 17.1c-.1.1-.15.22-.15.36zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                                            </svg>
                                        </button>
                                        <button
                                            className="meeting-action-btn delete-btn"
                                            title="Remover"
                                            onClick={() => onConfirmDelete(meeting.id)}
                                        >
                                            <svg viewBox="0 0 24 24">
                                                <rect x="4" y="4" width="16" height="2" rx="1" fill="white"></rect>
                                                <path d="M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6zm3.46-8.12a1 1 0 0 1 1.41 0L12 11.59l1.12-1.12a1 1 0 1 1 1.41 1.41L13.41 13l1.12 1.12a1 1 0 0 1-1.41 1.41L12 14.41l-1.12 1.12a1 1 0 0 1-1.41-1.41L10.59 13l-1.12-1.12a1 1 0 0 1 0-1.41z" />                                            </svg>
                                        </button>
                                    </div>
                                </>
                            )}
                        </li>
                    ))}
                </ul>
            </div>

        </>
    );
};

export default MeetingsList;