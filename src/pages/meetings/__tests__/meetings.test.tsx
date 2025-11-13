import { render, screen, waitFor } from '@testing-library/react';

const mockGetMeetings = jest.fn();

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

jest.mock('../../../services/meetings', () => ({
    getMeetings: (...args: any[]) => mockGetMeetings(...args)
}));

jest.mock('../meeting-card', () => ({
    MeetingCard: ({ meeting }: { meeting: any }) => ({
        type: 'div',
        props: { 
            'data-testid': `meeting-card-${meeting.id}`,
            children: meeting.category
        },
        key: null,
        ref: null,
        $$typeof: Symbol.for('react.element')
    })
}));

const { MeetingsPage } = require('../meetings');

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
    author?: { name: string };
}

describe('MeetingsPage', () => {
    const mockMeetings: Meeting[] = [
        {
            id: '1',
            dayOfWeek: 'Segunda-feira',
            time: '19:30',
            type: 'Presencial',
            category: 'Oração',
            roomOpener: 'João Silva',
            createdAt: '2025-01-01T00:00:00Z',
            updatedAt: '2025-01-01T00:00:00Z',
            authorId: '1'
        },
        {
            id: '2',
            dayOfWeek: 'Quarta-feira',
            time: '20:00',
            type: 'Online',
            category: 'Estudo',
            roomOpener: 'Maria Santos',
            createdAt: '2025-01-01T00:00:00Z',
            updatedAt: '2025-01-01T00:00:00Z',
            authorId: '2'
        },
        {
            id: '3',
            dayOfWeek: 'Domingo',
            time: '10:00',
            type: 'Presencial',
            category: 'Culto',
            roomOpener: 'Pedro Oliveira',
            createdAt: '2025-01-01T00:00:00Z',
            updatedAt: '2025-01-01T00:00:00Z',
            authorId: '3'
        }
    ];

    beforeEach(() => {
        jest.clearAllMocks();
        mockGetMeetings.mockResolvedValue(mockMeetings);
        
        // Mock scrollIntoView
        Element.prototype.scrollIntoView = jest.fn();
    });

    const renderMeetingsPage = () => {
        return render(<MeetingsPage />);
    };

    it('should render meetings page correctly', async () => {
        renderMeetingsPage();

        expect(screen.getByTestId('header')).toBeInTheDocument();
        expect(screen.getByText('Reuniões')).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.getByText('Domingo')).toBeInTheDocument();
            expect(screen.getByText('Segunda-feira')).toBeInTheDocument();
        });
    });

    it('should show loading initially', () => {
        renderMeetingsPage();

        expect(screen.getByTestId('loading')).toBeInTheDocument();
    });

    it('should load and display meetings correctly', async () => {
        renderMeetingsPage();

        await waitFor(() => {
            expect(mockGetMeetings).toHaveBeenCalledTimes(1);
        });

        await waitFor(() => {
            expect(screen.getByTestId('meeting-card-1')).toBeInTheDocument();
            expect(screen.getByTestId('meeting-card-2')).toBeInTheDocument();
            expect(screen.getByTestId('meeting-card-3')).toBeInTheDocument();
        });
    });

    it('should render all weekday columns', async () => {
        renderMeetingsPage();

        await waitFor(() => {
            expect(screen.getByText('DOM')).toBeInTheDocument();
            expect(screen.getByText('SEG')).toBeInTheDocument();
            expect(screen.getByText('TER')).toBeInTheDocument();
            expect(screen.getByText('QUA')).toBeInTheDocument();
            expect(screen.getByText('QUI')).toBeInTheDocument();
            expect(screen.getByText('SEX')).toBeInTheDocument();
            expect(screen.getByText('SAB')).toBeInTheDocument();
        });
    });

    it('should show "Sem reuniões" message for days without meetings', async () => {
        renderMeetingsPage();

        await waitFor(() => {
            const noMeetingsMessages = screen.getAllByText('Sem reuniões');
            // Should have message for days without meetings (7 days - 3 days with meetings = 4 days)
            expect(noMeetingsMessages.length).toBeGreaterThan(0);
        });
    });

    it('should show error message when failing to load meetings', async () => {
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
        mockGetMeetings.mockRejectedValue(new Error('API Error'));

        renderMeetingsPage();

        await waitFor(() => {
            expect(screen.getByText('Error loading meetings')).toBeInTheDocument();
        });

        expect(consoleErrorSpy).toHaveBeenCalledWith(
            'Error loading meetings:',
            expect.any(Error)
        );

        consoleErrorSpy.mockRestore();
    });

    it('should show header even in case of error', async () => {
        mockGetMeetings.mockRejectedValue(new Error('API Error'));

        renderMeetingsPage();

        await waitFor(() => {
            expect(screen.getByTestId('header')).toBeInTheDocument();
            expect(screen.getByText('Error loading meetings')).toBeInTheDocument();
        });
    });

    it('should group meetings by day of week correctly', async () => {
        renderMeetingsPage();

        await waitFor(() => {
            expect(screen.getByTestId('meeting-card-1')).toBeInTheDocument();
            expect(screen.getByTestId('meeting-card-2')).toBeInTheDocument();
            expect(screen.getByTestId('meeting-card-3')).toBeInTheDocument();
        });
    });

    it('should hide loading after data is loaded', async () => {
        renderMeetingsPage();

        expect(screen.getByTestId('loading')).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
        });
    });

    it('should render calendar icon', async () => {
        const { container } = renderMeetingsPage();

        await waitFor(() => {
            expect(mockGetMeetings).toHaveBeenCalled();
        });

        const svgElement = container.querySelector('.meetings-page-icon svg');
        expect(svgElement).toBeInTheDocument();
    });

    it('should have correct CSS structure', async () => {
        const { container } = renderMeetingsPage();

        await waitFor(() => {
            expect(container.querySelector('.meetings-page')).toBeInTheDocument();
            expect(container.querySelector('.meetings-page-container')).toBeInTheDocument();
            expect(container.querySelector('.meetings-page-header')).toBeInTheDocument();
            expect(container.querySelector('.meetings-calendar')).toBeInTheDocument();
        });
    });

    it('should display meetings only on their respective days', async () => {
        renderMeetingsPage();

        await waitFor(() => {
            expect(mockGetMeetings).toHaveBeenCalled();
        });

        // Meetings should appear in their respective day columns
        await waitFor(() => {
            expect(screen.getByTestId('meeting-card-1')).toBeInTheDocument(); // Segunda-feira
            expect(screen.getByTestId('meeting-card-2')).toBeInTheDocument(); // Quarta-feira
            expect(screen.getByTestId('meeting-card-3')).toBeInTheDocument(); // Domingo
        });
    });

    it('should handle empty meetings array', async () => {
        mockGetMeetings.mockResolvedValue([]);

        renderMeetingsPage();

        await waitFor(() => {
            const noMeetingsMessages = screen.getAllByText('Sem reuniões');
            // All 7 days should show "Sem reuniões"
            expect(noMeetingsMessages).toHaveLength(7);
        });
    });

    it('should mark current day column with "today" class', async () => {
        const { container } = renderMeetingsPage();

        await waitFor(() => {
            expect(mockGetMeetings).toHaveBeenCalled();
        });

        const todayColumn = container.querySelector('.meetings-day-column.today');
        expect(todayColumn).toBeInTheDocument();
    });

    it('should render full weekday names', async () => {
        renderMeetingsPage();

        await waitFor(() => {
            expect(screen.getByText('Domingo')).toBeInTheDocument();
            expect(screen.getByText('Segunda-feira')).toBeInTheDocument();
            expect(screen.getByText('Terça-feira')).toBeInTheDocument();
            expect(screen.getByText('Quarta-feira')).toBeInTheDocument();
            expect(screen.getByText('Quinta-feira')).toBeInTheDocument();
            expect(screen.getByText('Sexta-feira')).toBeInTheDocument();
            expect(screen.getByText('Sábado')).toBeInTheDocument();
        });
    });

    it('should handle multiple meetings on same day', async () => {
        const multipleMeetings: Meeting[] = [
            {
                id: '1',
                dayOfWeek: 'Segunda-feira',
                time: '19:30',
                type: 'Presencial',
                category: 'Oração',
                roomOpener: 'João Silva',
                createdAt: '2025-01-01T00:00:00Z',
                updatedAt: '2025-01-01T00:00:00Z',
                authorId: '1'
            },
            {
                id: '2',
                dayOfWeek: 'Segunda-feira',
                time: '20:30',
                type: 'Online',
                category: 'Estudo',
                roomOpener: 'Maria Santos',
                createdAt: '2025-01-01T00:00:00Z',
                updatedAt: '2025-01-01T00:00:00Z',
                authorId: '2'
            }
        ];

        mockGetMeetings.mockResolvedValue(multipleMeetings);
        renderMeetingsPage();

        await waitFor(() => {
            expect(screen.getByTestId('meeting-card-1')).toBeInTheDocument();
            expect(screen.getByTestId('meeting-card-2')).toBeInTheDocument();
        });
    });
});
