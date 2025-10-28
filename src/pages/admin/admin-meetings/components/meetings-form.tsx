import React, { FormEvent, useState } from "react";
import type { Meeting } from "../../../../services";
import { createMeeting, getMeetings } from "../../../../services";
import { Loading } from "../../../../components";
import { MEETING_CATEGORIES, MEETING_TYPES, DAYS_OF_WEEK } from "../constants";

import "../stylesheets/admin-meetings.css";

interface MeetingsFormProps {
    setMeetings: (meetings: Meeting[]) => void;
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

const MeetingsForm: React.FC<MeetingsFormProps> = ({ setMeetings }) => {
    const [createForm, setCreateForm] = useState<FormData>({
        dayOfWeek: "",
        time: "",
        type: "",
        category: "",
        roomOpener: ""
    });
    const [isCreateFormExpanded, setIsCreateFormExpanded] = useState(false);
    const [createMessage, setCreateMessage] = useState<MessageState>({ error: false, text: "" });
    const [loading, setLoading] = useState(false);

    const resetCreateForm = () => {
        setCreateForm({
            dayOfWeek: "",
            time: "",
            type: "",
            category: "",
            roomOpener: ""
        });
        setIsCreateFormExpanded(false);
        setCreateMessage({ error: false, text: "" });
    };

    const validateTime = (time: string): boolean => {
        // Validar formato HH:MM
        const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
        return timeRegex.test(time);
    };

    const handleCreateSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setCreateMessage({ error: false, text: "" });

        try {
            if (!validateTime(createForm.time)) {
                setCreateMessage({ error: true, text: "Formato de horário inválido. Use HH:MM (ex: 14:30)." });
                setLoading(false);
                return;
            }

            const meetingData = {
                dayOfWeek: createForm.dayOfWeek,
                time: createForm.time,
                type: createForm.type,
                category: createForm.category,
                roomOpener: createForm.roomOpener,
            };

            await createMeeting(meetingData);
            setCreateMessage({ error: false, text: "Reunião criada com sucesso!" });

            resetCreateForm();
            const updated = await getMeetings();
            setMeetings(updated);
        } catch (e: any) {
            setCreateMessage({ error: true, text: e.message || "Erro ao salvar reunião." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {loading && <Loading />}
            <div className="meetings-form-section">
                <div
                    className="form-header clickable"
                    onClick={() => setIsCreateFormExpanded(!isCreateFormExpanded)}
                    aria-expanded={isCreateFormExpanded}
                >
                    <h3>Adicionar Nova Reunião</h3>
                    <span className={`expand-icon ${isCreateFormExpanded ? 'expanded' : ''}`}>
                        ▼
                    </span>
                </div>
                {isCreateFormExpanded && (
                    <form onSubmit={handleCreateSubmit} className={`meetings-form expandable create-form`}>
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="meeting-dayOfWeek">Dia da Semana</label>
                                <select
                                    id="meeting-dayOfWeek"
                                    value={createForm.dayOfWeek}
                                    onChange={(e) => setCreateForm({ ...createForm, dayOfWeek: e.target.value })}
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
                                <label htmlFor="meeting-time">Horário</label>
                                <input
                                    id="meeting-time"
                                    type="time"
                                    value={createForm.time}
                                    onChange={(e) => setCreateForm({ ...createForm, time: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="meeting-category">Categoria</label>
                                <select
                                    id="meeting-category"
                                    value={createForm.category}
                                    onChange={(e) => setCreateForm({ ...createForm, category: e.target.value })}
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
                                <label htmlFor="meeting-type">Tipo</label>
                                <select
                                    id="meeting-type"
                                    value={createForm.type}
                                    onChange={(e) => setCreateForm({ ...createForm, type: e.target.value })}
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
                            <label htmlFor="meeting-roomOpener">Responsável por Abrir a Sala</label>
                            <input
                                id="meeting-roomOpener"
                                type="text"
                                placeholder="Nome do responsável"
                                value={createForm.roomOpener}
                                onChange={(e) => setCreateForm({ ...createForm, roomOpener: e.target.value })}
                                required
                            />
                        </div>
                        <div className="buttons">
                            <button type="submit" disabled={loading} className="submit-btn">
                                {(() => {
                                    if (loading) {
                                        return "Criando...";
                                    }
                                    return "Criar Reunião";
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

export default MeetingsForm;