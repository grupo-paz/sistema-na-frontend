import { Event, formatDate } from "../../services";

import "./stylesheets/event-card.css";

interface EventCardProps {
    event: Event;
}

export const EventCard = ({ event }: EventCardProps) => {
    return (
        <div className="event-card">
            <div className="event-content">
                <div className="event-header">
                    <h3 className="event-title">{event.title}</h3>
                    <span className="event-category">{event.category}</span>
                </div>
                
                <p className="event-description">{event.description}</p>
                
                <div className="event-details">
                    <div className="event-datetime">
                        <svg className="event-icon" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z" />
                        </svg>
                        <span>{formatDate(event.dateTime)}</span>
                    </div>
                    
                    <div className="event-location">
                        <svg className="event-icon" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                        </svg>
                        <span>{event.location}</span>
                    </div>
                    
                    <div className="event-type">
                        <svg className="event-icon" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                        <span>{event.type}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
