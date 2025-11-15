import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header, Loading } from "../../components";
import { getTodayMeeting, getNextEvent, Event, Meeting } from "../../services";
import { EventCard } from "../events/event-card";

import "./stylesheets/home.css";

export const Home = () => {
    const navigate = useNavigate();
    const [todayMeetings, setTodayMeetings] = useState<Meeting[]>([]);
    const [nextEvent, setNextEvent] = useState<Event | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadHomeData = async () => {
            try {
                setLoading(true);
                setError(null);

                const [meetingsData, eventData] = await Promise.all([
                    getTodayMeeting().catch(() => []),
                    getNextEvent().catch(() => null)
                ]);

                const meetings = Array.isArray(meetingsData) ? meetingsData : [];

                setTodayMeetings(meetings);
                setNextEvent(eventData);
            } catch (err) {
                console.error("Erro ao carregar dados da home:", err);
                setError("Erro ao carregar os dados");
            } finally {
                setLoading(false);
            }
        };

        loadHomeData();
    }, []);

    if (error) {
        return (
            <div className="home-page">
                <Header />
                <div className="home-container">
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
            <div className="home-page">
                <Header />
                <div className="home-page-container">
                    <div className="home-page-header">
                        <div className="home-page-icon">
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
                            </svg>
                        </div>
                        <h1>Grupo<b>Paz</b></h1>
                    </div>

                    <div className="home-page-content">
                        <section className="home-section">
                            <div className="home-section-header">
                                <div className="home-section-icon">
                                    <svg viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z" />
                                    </svg>
                                </div>
                                <h2>Reuniões de Hoje</h2>
                            </div>

                            {todayMeetings.length > 0 ? (
                                <div className="home-meetings-list">
                                    {todayMeetings.map((meeting) => (
                                        <div key={meeting.id} className="home-card">
                                            <h3>{meeting.category}</h3>
                                            <div className="home-card-info">
                                                <p><strong>Horário:</strong> {meeting.time} às {meeting.endTime}</p>
                                                <p><strong>Tipo:</strong> {meeting.type}</p>
                                                <p><strong>Responsável por abrir:</strong> {meeting.roomOpener}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="home-card-empty">
                                    <p>Nenhuma reunião agendada para hoje.</p>
                                </div>
                            )}

                            <button
                                className="home-button"
                                onClick={() => navigate("/reunioes")}
                            >
                                Ver todas as reuniões
                            </button>
                        </section>
                        <section className="home-section">
                            <div className="home-section-header">
                                <div className="home-section-icon">
                                    <svg viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                                    </svg>
                                </div>
                                <h2>Próximo Evento</h2>
                            </div>

                            {nextEvent ? (
                                <EventCard event={nextEvent}/>
                            ) : (
                                <div className="home-card-empty">
                                    <p>Nenhum evento agendado no momento.</p>
                                </div>
                            )}

                            <button
                                className="home-button"
                                onClick={() => navigate("/eventos")}
                            >
                                Ver todos os eventos
                            </button>
                        </section>
                        <section className="home-section home-section-full">
                            <div className="home-section-header">
                                <div className="home-section-icon">
                                    <svg viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                                    </svg>
                                </div>
                                <h2>Informações do Grupo</h2>
                            </div>

                            <div className="home-info-grid">
                                <div className="home-info-card">
                                    <div className="home-info-card-header">
                                        <svg viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z" />
                                        </svg>
                                        <h3>Chave PIX para Sétima</h3>
                                    </div>
                                    <div className="home-info-content">
                                        <div className="home-pix-container">
                                            <p className="home-pix-key">7agrupopaz@gmail.com</p>
                                            <button 
                                                className="home-pix-copy-btn"
                                                onClick={() => {
                                                    navigator.clipboard.writeText('7agrupopaz@gmail.com');
                                                    const btn = document.querySelector('.home-pix-copy-btn');
                                                    if (btn) {
                                                        btn.textContent = '✓ Copiado!';
                                                        setTimeout(() => {
                                                            btn.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>';
                                                        }, 2000);
                                                    }
                                                }}
                                                title="Copiar chave PIX"
                                            >
                                                <svg viewBox="0 0 24 24" fill="currentColor">
                                                    <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
                                                </svg>
                                            </button>
                                        </div>
                                        <p className="home-pix-description">
                                            Use esta chave para contribuir com a sétima do grupo
                                        </p>
                                    </div>
                                </div>
                                <div className="home-info-card">
                                    <div className="home-info-card-header">
                                        <svg viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                                        </svg>
                                        <h3>Localização</h3>
                                    </div>
                                    <div className="home-info-content">
                                        <p className="home-address">
                                            Avenida João Antunes dos Santos, 530 <br />
                                            Jardim Pinheiros <br />
                                            Valinhos - SP                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="home-map-container">
                                <iframe
                                    title="Localização do Grupo"
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d918.4158877494663!2d-46.98295367600383!3d-22.962614790179973!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94c8cd8b001ccb6f%3A0x59d58db88e408236!2zTmFyY8OzdGljb3MgQW7DtG5pbW9z!5e0!3m2!1spt-BR!2sbr!4v1763060473607!5m2!1spt-BR!2sbr"
                                    width="100%"
                                    height="400"
                                    style={{ border: 0, borderRadius: "12px" }}
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                ></iframe>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </>
    );
};