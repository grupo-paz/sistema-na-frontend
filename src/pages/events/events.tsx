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
                            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z"></path></svg>
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
