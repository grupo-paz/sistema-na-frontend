import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import AdminEvents from '../admin-events';
import * as services from '../../../../services';
import { Event } from '../../../../services';

jest.mock('../../../../services', () => ({
    getEvents: jest.fn(),
    removeEvent: jest.fn(),
    formatDate: jest.fn(),
    updateEvent: jest.fn(),
}));

jest.mock('../../../../components', () => ({
    Loading: () => <div data-testid="loading">Loading...</div>,
    Header: () => <div data-testid="header">Header</div>,
    withConfirmModal: (Component: any) => {
        return (props: any) => <Component {...props} showConfirm={mockShowConfirm} />;
    },
}));

jest.mock('../components/events-form', () => ({
    __esModule: true,
    default: ({ setEvents }: any) => (
        <div data-testid="events-form">
            <button onClick={() => setEvents([])}>Set Events</button>
        </div>
    ),
}));

jest.mock('../components/events-list', () => ({
    __esModule: true,
    default: ({ events, onConfirmDelete }: any) => (
        <div data-testid="events-list">
            {events.map((event: any) => (
                <div key={event.id}>
                    <span>{event.title}</span>
                    <button onClick={() => onConfirmDelete(event.id)}>Delete Event</button>
                </div>
            ))}
        </div>
    ),
}));

const mockServices = services as jest.Mocked<typeof services>;
const mockShowConfirm = jest.fn();

const mockEvent: Event = {
    id: 'event-1',
    title: 'Test Event',
    description: 'Test Description',
    dateTime: '2025-12-01T10:00:00Z',
    location: 'Test Location',
    type: 'presencial',
    category: 'reunião',
    createdAt: '2025-10-01T10:00:00Z',
    updatedAt: '2025-10-01T10:00:00Z',
    authorId: 'author-1',
    author: { name: 'Test Author' }
};

const futureEvent: Event = {
    ...mockEvent,
    dateTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // Amanhã
};

const pastEvent: Event = {
    ...mockEvent,
    id: 'event-2',
    dateTime: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() // Ontem
};

describe('AdminEvents', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockServices.getEvents.mockResolvedValue([futureEvent]);
    });

    it('should render main components', async () => {
        render(<AdminEvents />);

        expect(screen.getByTestId('header')).toBeInTheDocument();
        expect(screen.getByText('Eventos')).toBeInTheDocument();
        expect(screen.getByTestId('events-form')).toBeInTheDocument();
        expect(screen.getByTestId('events-list')).toBeInTheDocument();
    });

    it('should load events on mount', async () => {
        render(<AdminEvents />);

        await waitFor(() => {
            expect(mockServices.getEvents).toHaveBeenCalledTimes(1);
        });
    });

    it('should show loading state', () => {
        mockServices.getEvents.mockImplementation(() => new Promise(() => {}));
        render(<AdminEvents />);

        expect(screen.getByTestId('loading')).toBeInTheDocument();
    });

    it('should filter future events correctly', async () => {
        render(<AdminEvents />);
        
        await waitFor(() => {
            expect(mockServices.getEvents).toHaveBeenCalled();
        });

        mockServices.getEvents.mockResolvedValue([futureEvent, pastEvent]);
        
        fireEvent.click(screen.getByText('Set Events'));
        
        await waitFor(() => {
            expect(mockServices.getEvents).toHaveBeenCalled();
        });
    });

    it('should handle confirm delete', async () => {
        render(<AdminEvents />);

        await waitFor(() => {
            expect(mockServices.getEvents).toHaveBeenCalled();
        });

        await waitFor(() => {
            expect(screen.getByText('Delete Event')).toBeInTheDocument();
        }, { timeout: 5000 });

        fireEvent.click(screen.getByText('Delete Event'));

        expect(mockShowConfirm).toHaveBeenCalledWith({
            title: 'Confirmar Exclusão',
            message: 'Tem certeza que deseja excluir o evento "Test Event"?',
            onConfirm: expect.any(Function),
        });
    });

    it('should delete event when confirmed', async () => {
        mockServices.removeEvent.mockResolvedValue({ message: 'Evento removido com sucesso' });
        
        render(<AdminEvents />);

        await waitFor(() => {
            expect(mockServices.getEvents).toHaveBeenCalled();
        });

        await waitFor(() => {
            expect(screen.getByText('Delete Event')).toBeInTheDocument();
        }, { timeout: 5000 });

        fireEvent.click(screen.getByText('Delete Event'));

        mockServices.getEvents.mockResolvedValue([]);

        const confirmCall = mockShowConfirm.mock.calls[0][0];
        await confirmCall.onConfirm();

        expect(mockServices.removeEvent).toHaveBeenCalledWith('event-1');
        expect(mockServices.getEvents).toHaveBeenCalledTimes(2); 
    });

    it('should handle error when loading events', async () => {
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
        mockServices.getEvents.mockRejectedValue(new Error('Network error'));

        render(<AdminEvents />);

        await waitFor(() => {
            expect(consoleSpy).toHaveBeenCalledWith('Erro ao carregar eventos:', expect.any(Error));
        });

        consoleSpy.mockRestore();
    });

    it('should handle error when deleting event', async () => {
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
        mockServices.removeEvent.mockRejectedValue(new Error('Delete error'));

        render(<AdminEvents />);

        await waitFor(() => {
            expect(mockServices.getEvents).toHaveBeenCalled();
        });

        await waitFor(() => {
            expect(screen.getByText('Delete Event')).toBeInTheDocument();
        }, { timeout: 5000 });

        fireEvent.click(screen.getByText('Delete Event'));
        const confirmCall = mockShowConfirm.mock.calls[0][0];
        await confirmCall.onConfirm();

        await waitFor(() => {
            expect(consoleSpy).toHaveBeenCalledWith('Erro ao deletar evento:', expect.any(Error));
        });

        consoleSpy.mockRestore();
    });
});
