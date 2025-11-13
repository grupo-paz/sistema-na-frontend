import { useState, useEffect } from "react";
import { Header, Loading } from "../../components";
import { getEvents, Event, filterFutureEvents, groupEventsByMonth } from "../../services";
import { EventCard } from "./event-card";

import "./stylesheets/events.css";

export const EventsPage = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadEventsData = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await getEvents();
                const futureEvents = await filterFutureEvents(data);
                setEvents(futureEvents);
            } catch (err) {
                console.error("Erro ao carregar dados dos eventos:", err);
                setError("Erro ao carregar os dados dos eventos");
            } finally {
                setLoading(false);
            }
        };

        loadEventsData();
    }, []);

    if (error) {
        return (
            <div className="events-page">
                <Header />
                <div className="events-container">
                    <div className="error-message">
                        <p>{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            {loading && <Loading />}
            <div className="events-page">
                <Header />
                <div className="events-page-container">
                    <div className="events-page-header">
                        <div className="events-page-icon">
                            <svg className="nav-icon" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                            </svg>
                        </div>
                        <h1>Eventos</h1>
                    </div>

                    <div className="events-page-content">
                        {events.length === 0 && !loading ? (
                            <div className="events-page-no-events">
                                <p>Nenhum evento disponível no momento.</p>
                            </div>
                        ) : (
                            groupEventsByMonth(events).map((monthGroup) => (
                                <div key={monthGroup.key} className="events-month-group">
                                    <h2 className="events-month-title">{monthGroup.label}</h2>
                                    <div className="events-page-grid">
                                        {monthGroup.events.map((event) => (
                                            <EventCard key={event.id} event={event} />
                                        ))}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};
