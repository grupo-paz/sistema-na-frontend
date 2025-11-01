import { render, screen, waitFor } from '@testing-library/react';

const mockGetEvents = jest.fn();
const mockFilterFutureEvents = jest.fn();
const mockGroupEventsByMonth = jest.fn();

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
    getEvents: (...args: any[]) => mockGetEvents(...args),
    filterFutureEvents: (...args: any[]) => mockFilterFutureEvents(...args),
    groupEventsByMonth: (...args: any[]) => mockGroupEventsByMonth(...args)
}));

jest.mock('../event-card', () => ({
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

const { EventsPage } = require('../events');

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

describe('EventsPage', () => {
    const mockEvents: Event[] = [
        {
            id: '1',
            title: 'Event 1',
            description: 'Description of event 1',
            dateTime: '2025-12-25T15:00:00Z',
            location: 'Location 1',
            type: 'Lecture',
            category: 'Academic',
            createdAt: '2025-01-01T00:00:00Z',
            updatedAt: '2025-01-01T00:00:00Z',
            authorId: '1',
            author: { name: 'Author 1' }
        },
        {
            id: '2',
            title: 'Event 2',
            description: 'Description of event 2',
            dateTime: '2025-11-15T10:00:00Z',
            location: 'Location 2',
            type: 'Workshop',
            category: 'Technical',
            createdAt: '2025-01-01T00:00:00Z',
            updatedAt: '2025-01-01T00:00:00Z',
            authorId: '2',
            author: { name: 'Author 2' }
        }
    ];

    const mockGroupedEvents = [
        {
            key: '2025-12',
            label: 'December 2025',
            events: [mockEvents[0]]
        },
        {
            key: '2025-11',
            label: 'November 2025',
            events: [mockEvents[1]]
        }
    ];

    beforeEach(() => {
        jest.clearAllMocks();
        
        mockGetEvents.mockResolvedValue(mockEvents);
        mockFilterFutureEvents.mockResolvedValue(mockEvents);
        mockGroupEventsByMonth.mockReturnValue(mockGroupedEvents);
    });

    const renderEventsPage = () => {
        return render(<EventsPage />);
    };

    it('should render events page correctly', async () => {
        renderEventsPage();

        expect(screen.getByTestId('header')).toBeInTheDocument();
        expect(screen.getByText('Eventos')).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.getByText('December 2025')).toBeInTheDocument();
            expect(screen.getByText('November 2025')).toBeInTheDocument();
        });
    });

    it('should show loading initially', () => {
        renderEventsPage();

        expect(screen.getByTestId('loading')).toBeInTheDocument();
    });

    it('should load and display events correctly', async () => {
        renderEventsPage();

        await waitFor(() => {
            expect(mockGetEvents).toHaveBeenCalledTimes(1);
            expect(mockFilterFutureEvents).toHaveBeenCalledWith(mockEvents);
            expect(mockGroupEventsByMonth).toHaveBeenCalledWith(mockEvents);
        });

        await waitFor(() => {
            expect(screen.getByTestId('event-card-1')).toBeInTheDocument();
            expect(screen.getByTestId('event-card-2')).toBeInTheDocument();
        });
    });

    it('should show message when there are no events', async () => {
        mockGetEvents.mockResolvedValue([]);
        mockFilterFutureEvents.mockResolvedValue([]);
        mockGroupEventsByMonth.mockReturnValue([]);

        renderEventsPage();

        await waitFor(() => {
            expect(screen.getByText('Nenhum evento disponível no momento.')).toBeInTheDocument();
        });
    });

    it('should show error when failing to load events', async () => {
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
        mockGetEvents.mockRejectedValue(new Error('API Error'));

        renderEventsPage();

        await waitFor(() => {
            expect(screen.getByText('Erro ao carregar os dados dos eventos')).toBeInTheDocument();
        });

        expect(consoleErrorSpy).toHaveBeenCalledWith(
            'Erro ao carregar dados dos eventos:',
            expect.any(Error)
        );

        consoleErrorSpy.mockRestore();
    });

    it('should reset error and loading when trying to load again', async () => {
        renderEventsPage();

        await waitFor(() => {
            expect(mockGetEvents).toHaveBeenCalledTimes(1);
        });

        await waitFor(() => {
            expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
        });
    });

    it('should show header even in case of error', async () => {
        mockGetEvents.mockRejectedValue(new Error('API Error'));

        renderEventsPage();

        await waitFor(() => {
            expect(screen.getByTestId('header')).toBeInTheDocument();
            expect(screen.getByText('Erro ao carregar os dados dos eventos')).toBeInTheDocument();
        });
    });

    it('should group events by month correctly', async () => {
        renderEventsPage();

        await waitFor(() => {
            expect(mockGroupEventsByMonth).toHaveBeenCalledWith(mockEvents);
        });

        await waitFor(() => {
            expect(screen.getByText('December 2025')).toBeInTheDocument();
            expect(screen.getByText('November 2025')).toBeInTheDocument();
        });
    });

    it('should render multiple events in the same month', async () => {
        const eventsInSameMonth = [
            mockEvents[0],
            {
                ...mockEvents[1],
                id: '3',
                title: 'Event 3',
                dateTime: '2025-12-30T14:00:00Z'
            }
        ];

        const sameMonthGroup = [
            {
                key: '2025-12',
                label: 'December 2025',
                events: eventsInSameMonth
            }
        ];

        mockFilterFutureEvents.mockResolvedValue(eventsInSameMonth);
        mockGroupEventsByMonth.mockReturnValue(sameMonthGroup);

        renderEventsPage();

        await waitFor(() => {
            expect(screen.getByTestId('event-card-1')).toBeInTheDocument();
            expect(screen.getByTestId('event-card-3')).toBeInTheDocument();
        });
    });

    it('should have correct CSS structure', async () => {
        const { container } = renderEventsPage();

        expect(container.querySelector('.events-page')).toBeInTheDocument();
        expect(container.querySelector('.events-page-container')).toBeInTheDocument();
        expect(container.querySelector('.events-page-header')).toBeInTheDocument();
        expect(container.querySelector('.events-page-icon')).toBeInTheDocument();

        await waitFor(() => {
            expect(container.querySelector('.events-page-content')).toBeInTheDocument();
        });
    });

    it('should apply correct CSS classes for month groups', async () => {
        const { container } = renderEventsPage();

        await waitFor(() => {
            expect(container.querySelector('.events-month-group')).toBeInTheDocument();
            expect(container.querySelector('.events-month-title')).toBeInTheDocument();
            expect(container.querySelector('.events-page-grid')).toBeInTheDocument();
        });
    });

    it('should render SVG icon in header', async () => {
        const { container } = renderEventsPage();

        const svgElement = container.querySelector('.events-page-icon svg');
        expect(svgElement).toBeInTheDocument();
        expect(svgElement).toHaveAttribute('viewBox', '0 0 24 24');
    });

    it('should call filterFutureEvents only after getting events', async () => {
        renderEventsPage();

        await waitFor(() => {
            expect(mockGetEvents).toHaveBeenCalledTimes(1);
        });

        expect(mockFilterFutureEvents).toHaveBeenCalledWith(mockEvents);
        expect(mockFilterFutureEvents).toHaveBeenCalledTimes(1);
    });

    it('should handle filterFutureEvents failure', async () => {
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
        mockFilterFutureEvents.mockRejectedValue(new Error('Filter error'));

        renderEventsPage();

        await waitFor(() => {
            expect(screen.getByText('Erro ao carregar os dados dos eventos')).toBeInTheDocument();
        });

        consoleErrorSpy.mockRestore();
    });
});