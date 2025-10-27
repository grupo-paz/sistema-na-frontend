import React, { useEffect, useState } from "react";
import { Event, getEvents, removeEvent } from "../../../services";
import { Loading, Header, withConfirmModal, ConfirmModalOptions } from "../../../components";
import { EventsForm, EventsList } from "./components";

import "./stylesheets/admin-events.css";

const AdminEvents: React.FC<{ showConfirm: (options: ConfirmModalOptions) => void }> = ({ showConfirm }) => {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
    const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);

    const filterFutureEvents = async (eventList: Event[]): Promise<Event[]> => {
        const now = new Date();
        const futureEvents: Event[] = [];

        for (const event of eventList) {
            const eventDate = new Date(event.dateTime);
            if (eventDate > now) {
                futureEvents.push(event);
            }
        }

        return futureEvents;
    };

    // Carregar eventos na inicialização
    useEffect(() => {
        const loadEvents = async () => {
            setLoading(true);
            try {
                const data = await getEvents();
                const futureEvents = await filterFutureEvents(data);
                setEvents(futureEvents);
            } catch (error) {
                console.error("Erro ao carregar eventos:", error);
            } finally {
                setLoading(false);
            }
        };

        loadEvents();
    }, []);

    useEffect(() => {
        if (showDeleteConfirmModal && selectedEventId) {
            const selectedEvent = events.find(event => event.id === selectedEventId);
            showConfirm({
                title: "Confirmar Exclusão",
                message: `Tem certeza que deseja excluir o evento "${selectedEvent?.title}"?`,
                onConfirm: () => {
                    handleDeleteEvent(selectedEventId);
                },
            });
        }
    }, [showDeleteConfirmModal, selectedEventId]);

    const handleDeleteEvent = async (eventId: string) => {
        setLoading(true);
        try {
            await removeEvent(eventId);
            const updated = await getEvents();
            const futureEvents = await filterFutureEvents(updated);
            setEvents(futureEvents);
        } catch (error) {
            console.error("Erro ao deletar evento:", error);
        } finally {
            setLoading(false);
            setSelectedEventId(null);
            setShowDeleteConfirmModal(false);
        }
    };

    const handleConfirmDelete = (eventId: string) => {
        setSelectedEventId(eventId);
        setShowDeleteConfirmModal(true);
    };

    return (
        <>
            {loading && <Loading />}
            <Header />
            <div className="page-content">
                <div className="events-page-header">
                    <h1>Eventos</h1>
                </div>
                <EventsForm
                    setEvents={setEvents}
                    filterFutureEvents={filterFutureEvents}
                />
                <EventsList
                    events={events}
                    setEvents={setEvents}
                    filterFutureEvents={filterFutureEvents}
                    onConfirmDelete={handleConfirmDelete}
                />
            </div>
        </>
    );
};

export default withConfirmModal(AdminEvents);
