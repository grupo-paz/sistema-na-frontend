import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const mockNavigate = jest.fn();
const mockGetTodayMeeting = jest.fn();
const mockGetNextEvent = jest.fn();

jest.mock('react-router-dom', () => ({
    useNavigate: () => mockNavigate,
}));

jest.mock('../../../components', () => ({
    Header: () => ({
        type: 'div',
        props: { 'data-testid': 'header', children: 'Header' },
        key: null,
        ref: null,
        $$typeof: Symbol.for('react.element')
    }),
    Loading: () => ({
        type: 'div',
        props: { 'data-testid': 'loading', children: 'Loading...' },
        key: null,
        ref: null,
        $$typeof: Symbol.for('react.element')
    })
}));

jest.mock('../../../services', () => ({
    getTodayMeeting: (...args: any[]) => mockGetTodayMeeting(...args),
    getNextEvent: (...args: any[]) => mockGetNextEvent(...args)
}));

jest.mock('../../events/event-card', () => ({
    EventCard: ({ event }: { event: any }) => ({
        type: 'div',
        props: { 
            'data-testid': `event-card-${event.id}`,
            children: event.title
        },
        key: null,
        ref: null,
        $$typeof: Symbol.for('react.element')
    })
}));

const { Home } = require('../home');

interface Meeting {
    id: string;
    dayOfWeek: string;
    time: string;
    type: string;
    category: string;
    roomOpener: string;
    createdAt: string;
    updatedAt: string;
    authorId: string;
}

interface Event {
    id: string;
    title: string;
    description: string;
    dateTime: string;
    location: string;
    type: string;
    category: string;
    createdAt: string;
    updatedAt: string;
    authorId: string;
    author: { name: string };
}

describe('Home', () => {
    const mockMeetings: Meeting[] = [
        {
            id: '1',
            dayOfWeek: 'Quinta-feira',
            time: '19:30',
            type: 'Fechada',
            category: 'Oração',
            roomOpener: 'João Silva',
            createdAt: '2025-01-01T00:00:00Z',
            updatedAt: '2025-01-01T00:00:00Z',
            authorId: '1'
        },
        {
            id: '2',
            dayOfWeek: 'Quinta-feira',
            time: '20:30',
            type: 'Aberta',
            category: 'Tradicional',
            roomOpener: 'Maria Santos',
            createdAt: '2025-01-01T00:00:00Z',
            updatedAt: '2025-01-01T00:00:00Z',
            authorId: '2'
        }
    ];

    const mockEvent: Event = {
        id: '1',
        title: 'Evento de Natal',
        description: 'Evento especial de Natal',
        dateTime: '2025-12-25T15:00:00Z',
        location: 'Salão Principal',
        type: 'Celebração',
        category: 'Especial',
        createdAt: '2025-01-01T00:00:00Z',
        updatedAt: '2025-01-01T00:00:00Z',
        authorId: '1',
        author: { name: 'Admin' }
    };

    beforeEach(() => {
        jest.clearAllMocks();
        mockGetTodayMeeting.mockResolvedValue(mockMeetings);
        mockGetNextEvent.mockResolvedValue(mockEvent);
    });

    const renderHome = () => {
        return render(<Home />);
    };

    it('should render home page correctly', async () => {
        renderHome();

        expect(screen.getByTestId('header')).toBeInTheDocument();
        expect(screen.getByText('Grupo')).toBeInTheDocument();
        expect(screen.getByText('Paz')).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.getByText('Reuniões de Hoje')).toBeInTheDocument();
            expect(screen.getByText('Próximo Evento')).toBeInTheDocument();
            expect(screen.getByText('Informações do Grupo')).toBeInTheDocument();
        });
    });

    it('should show loading initially', () => {
        renderHome();

        expect(screen.getByTestId('loading')).toBeInTheDocument();
    });

    it('should load and display today meetings correctly', async () => {
        renderHome();

        await waitFor(() => {
            expect(mockGetTodayMeeting).toHaveBeenCalledTimes(1);
        });

        await waitFor(() => {
            expect(screen.getByText('Oração')).toBeInTheDocument();
            expect(screen.getByText('Tradicional')).toBeInTheDocument();
            expect(screen.getByText('19:30')).toBeInTheDocument();
            expect(screen.getByText('20:30')).toBeInTheDocument();
            expect(screen.getByText('João Silva')).toBeInTheDocument();
            expect(screen.getByText('Maria Santos')).toBeInTheDocument();
        });
    });

    it('should load and display next event correctly', async () => {
        renderHome();

        await waitFor(() => {
            expect(mockGetNextEvent).toHaveBeenCalledTimes(1);
        });

        await waitFor(() => {
            expect(screen.getByTestId('event-card-1')).toBeInTheDocument();
        });
    });

    it('should show message when there are no meetings today', async () => {
        mockGetTodayMeeting.mockResolvedValue([]);

        renderHome();

        await waitFor(() => {
            expect(screen.getByText('Nenhuma reunião agendada para hoje.')).toBeInTheDocument();
        });
    });

    it('should show message when there is no next event', async () => {
        mockGetNextEvent.mockResolvedValue(null);

        renderHome();

        await waitFor(() => {
            expect(screen.getByText('Nenhum evento agendado no momento.')).toBeInTheDocument();
        });
    });

    it('should navigate to meetings page when "Ver todas as reuniões" is clicked', async () => {
        const user = userEvent.setup();
        renderHome();

        await waitFor(() => {
            expect(screen.getByText('Ver todas as reuniões')).toBeInTheDocument();
        });

        const button = screen.getByText('Ver todas as reuniões');
        await user.click(button);

        expect(mockNavigate).toHaveBeenCalledWith('/reunioes');
    });

    it('should navigate to events page when "Ver todos os eventos" is clicked', async () => {
        const user = userEvent.setup();
        renderHome();

        await waitFor(() => {
            expect(screen.getByText('Ver todos os eventos')).toBeInTheDocument();
        });

        const button = screen.getByText('Ver todos os eventos');
        await user.click(button);

        expect(mockNavigate).toHaveBeenCalledWith('/eventos');
    });

    it('should display group information section', async () => {
        renderHome();

        await waitFor(() => {
            expect(screen.getByText('Chave PIX para Sétima')).toBeInTheDocument();
            expect(screen.getByText('Localização')).toBeInTheDocument();
            expect(screen.getByText(/Avenida João Antunes dos Santos/i)).toBeInTheDocument();
        });
    });

    it('should handle API errors gracefully', async () => {
        mockGetTodayMeeting.mockRejectedValue(new Error('API Error'));
        mockGetNextEvent.mockRejectedValue(new Error('API Error'));

        renderHome();

        await waitFor(() => {
            expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
        });

        // Should still show empty state messages instead of crashing
        await waitFor(() => {
            expect(screen.getByText('Nenhuma reunião agendada para hoje.')).toBeInTheDocument();
            expect(screen.getByText('Nenhum evento agendado no momento.')).toBeInTheDocument();
        });
    });

    it('should render map iframe correctly', async () => {
        renderHome();

        await waitFor(() => {
            const iframe = screen.getByTitle('Localização do Grupo');
            expect(iframe).toBeInTheDocument();
            expect(iframe).toHaveAttribute('src');
        });
    });
});
