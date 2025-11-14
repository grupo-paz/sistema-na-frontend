import { useState, useEffect, useRef } from "react";
import { Header, Loading } from "../../components";
import { getMeetings } from "../../services/meetings";
import { Meeting } from "../../services/types";
import { MeetingCard } from "./meeting-card";
import "./stylesheets/meetings.css";

const WEEKDAYS = [
    { key: "Domingo", label: "Domingo", short: "DOM" },
    { key: "Segunda-feira", label: "Segunda-feira", short: "SEG" },
    { key: "Terça-feira", label: "Terça-feira", short: "TER" },
    { key: "Quarta-feira", label: "Quarta-feira", short: "QUA" },
    { key: "Quinta-feira", label: "Quinta-feira", short: "QUI" },
    { key: "Sexta-feira", label: "Sexta-feira", short: "SEX" },
    { key: "Sábado", label: "Sábado", short: "SAB" },
];

export const MeetingsPage = () => {
    const [meetings, setMeetings] = useState<Meeting[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
   const [_selectedMeeting, _setSelectedMeeting] = useState(null);
    const [currentDayIndex] = useState(new Date().getDay());
    const calendarRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const loadMeetingsData = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await getMeetings();
                setMeetings(data);
            } catch (err) {
                console.error("Error loading meetings:", err);
                setError("Error loading meetings");
            } finally {
                setLoading(false);
            }
        };

        loadMeetingsData();
    }, []);

    useEffect(() => {
        if (!loading && calendarRef.current) {
            const todayColumn = calendarRef.current.querySelector('.meetings-day-column.today');
            if (todayColumn) {
                todayColumn.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest',
                    inline: 'center'
                });
            }
        }
    }, [loading]);

    const getMeetingsForDay = (dayOfWeek: string) => {
        return meetings.filter(meeting => meeting.dayOfWeek === dayOfWeek);
    };

    if (error) {
        return (
            <div className="meetings-page">
                <Header />
                <div className="meetings-container">
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
            <div className="meetings-page">
                <Header />
                <div className="meetings-page-container">
                    <div className="meetings-page-header">
                        <div className="meetings-page-icon">
                            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z"></path></svg>
                        </div>
                        <h1>Reuniões</h1>
                    </div>

                    <div className="meetings-calendar" ref={calendarRef}>
                        {WEEKDAYS.map((day, index) => {
                            const dayMeetings = getMeetingsForDay(day.key);
                            const isToday = index === currentDayIndex;

                            return (
                                <div
                                    key={day.key}
                                    className={`meetings-day-column ${isToday ? "today" : ""}`}
                                >
                                    <div className="meetings-day-header">
                                        <div className="meetings-day-name">{day.short}</div>
                                        <div className="meetings-day-full">{day.label}</div>
                                    </div>

                                    <div className="meetings-day-content">
                                        {dayMeetings.length === 0 ? (
                                            <div className="no-meetings">Sem reuniões</div>
                                        ) : (
                                            dayMeetings.map((meeting) => (
                                                <MeetingCard
                                                    key={meeting.id}
                                                    meeting={meeting}
                                                />
                                            ))
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </>
    );
};
