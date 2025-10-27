import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import EventsList from '../events-list';
import * as services from '../../../../../services';

jest.mock('../../../../../services', () => ({
    updateEvent: jest.fn(),
    removeEvent: jest.fn(),
    getEvents: jest.fn(),
    formatDate: jest.fn((date: string) => {
        const d = new Date(date);
        return d.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    }),
}));

jest.mock('../../constants', () => ({
    EVENT_CATEGORIES: [
        { value: '', label: 'Selecione uma categoria' },
        { value: 'reuniao', label: 'Reunião' },
        { value: 'workshop', label: 'Workshop' },
    ],
    EVENT_TYPES: [
        { value: '', label: 'Selecione um tipo' },
        { value: 'presencial', label: 'Presencial' },
        { value: 'virtual', label: 'Virtual' },
    ],
}));

const mockServices = services as jest.Mocked<typeof services>;

const mockEvent = {
    id: 'event-1',
    title: 'Test Event',
    description: 'Test Description',
    dateTime: '2025-02-15T10:00:00Z',
    location: 'Test Location',
    type: 'presencial',
    category: 'reuniao',
    author: { id: 'author-1', name: 'Test Author' },
    authorId: 'author-1',
    createdAt: '2025-01-01T10:00:00Z',
    updatedAt: '2025-01-01T10:00:00Z'
};

const mockEvent2 = {
    id: 'event-2',
    title: 'Test Event 2',
    description: 'Test Description 2',
    dateTime: '2025-03-15T10:00:00Z',
    location: 'Test Location 2',
    type: 'virtual',
    category: 'workshop',
    author: { id: 'author-2', name: 'Test Author 2' },
    authorId: 'author-2',
    createdAt: '2025-01-01T10:00:00Z',
    updatedAt: '2025-01-01T10:00:00Z'
};

describe('EventsList', () => {
    const mockSetEvents = jest.fn();
    const mockFilterFutureEvents = jest.fn();
    const mockOnConfirmDelete = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        mockServices.updateEvent.mockResolvedValue(mockEvent);
        mockServices.removeEvent.mockResolvedValue({ message: 'Event deleted successfully' });
        mockServices.getEvents.mockResolvedValue([mockEvent, mockEvent2]);
        mockFilterFutureEvents.mockResolvedValue([mockEvent, mockEvent2]);
    });

    const renderComponent = (events = [mockEvent, mockEvent2]) => {
        return render(
            <EventsList
                events={events}
                setEvents={mockSetEvents}
                filterFutureEvents={mockFilterFutureEvents}
                onConfirmDelete={mockOnConfirmDelete}
            />
        );
    };

    it('should render events list', () => {
        renderComponent();
        
        expect(screen.getByText('Test Event')).toBeInTheDocument();
        expect(screen.getByText('Test Event 2')).toBeInTheDocument();
        expect(screen.getByText('Por: Test Author')).toBeInTheDocument();
        expect(screen.getByText('Por: Test Author 2')).toBeInTheDocument();
    });

    it('should group events by month', () => {
        renderComponent();
        
        expect(screen.getByText('Fevereiro/2025')).toBeInTheDocument();
        expect(screen.getByText('Março/2025')).toBeInTheDocument();
    });

    it('should show empty state when no events', () => {
        renderComponent([]);
        
        expect(screen.getByText('Nenhum evento cadastrado ainda.')).toBeInTheDocument();
    });

    it('should enter edit mode when edit button is clicked', () => {
        renderComponent();
        
        const editButtons = screen.getAllByTitle('Editar');
        fireEvent.click(editButtons[0]);

        expect(screen.getByDisplayValue('Test Event')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Test Description')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Test Location')).toBeInTheDocument();
        
        expect(screen.getByText('Salvar')).toBeInTheDocument();
        expect(screen.getByText('Cancelar')).toBeInTheDocument();
    });

    it('should update event when save button is clicked', async () => {
        renderComponent();
        
        const editButtons = screen.getAllByTitle('Editar');
        fireEvent.click(editButtons[0]);

        const titleInput = screen.getByDisplayValue('Test Event');
        fireEvent.change(titleInput, { target: { value: 'Updated Event' } });

        const descriptionInput = screen.getByDisplayValue('Test Description');
        fireEvent.change(descriptionInput, { target: { value: 'Updated Description' } });

        const dateInput = screen.getByDisplayValue(/2025-02-15T/);
        fireEvent.change(dateInput, { target: { value: '2026-12-15T10:00' } });

        fireEvent.click(screen.getByText('Salvar'));

        await waitFor(() => {
            expect(mockServices.updateEvent).toHaveBeenCalledWith('event-1', {
                title: 'Updated Event',
                description: 'Updated Description',
                location: 'Test Location',
                dateTime: expect.any(String),
                category: 'reuniao',
                type: 'presencial',
            });
        });

        await waitFor(() => {
            expect(mockServices.getEvents).toHaveBeenCalled();
            expect(mockFilterFutureEvents).toHaveBeenCalled();
            expect(mockSetEvents).toHaveBeenCalled();
        });
    });

    it('should cancel edit mode when cancel button is clicked', () => {
        renderComponent();
        
        const editButtons = screen.getAllByTitle('Editar');
        fireEvent.click(editButtons[0]);

        expect(screen.getByDisplayValue('Test Event')).toBeInTheDocument();

        fireEvent.click(screen.getByText('Cancelar'));

        expect(screen.queryByDisplayValue('Test Event')).not.toBeInTheDocument();
        expect(screen.getByText('Test Event')).toBeInTheDocument();
    });

    it('should call confirm callback when delete button is clicked', () => {
        renderComponent();
        
        const deleteButtons = screen.getAllByTitle('Remover');
        fireEvent.click(deleteButtons[0]);

        expect(mockOnConfirmDelete).toHaveBeenCalledWith('event-1');
    });

    it('should show error message when update fails', async () => {
        mockServices.updateEvent.mockRejectedValue(new Error('Update failed'));

        renderComponent();
        
        const editButtons = screen.getAllByTitle('Editar');
        fireEvent.click(editButtons[0]);

        const dateInput = screen.getByDisplayValue(/2025-02-15T/);
        fireEvent.change(dateInput, { target: { value: '2026-12-15T10:00' } });

        fireEvent.click(screen.getByText('Salvar'));

        await waitFor(() => {
            expect(screen.getByText('Update failed')).toBeInTheDocument();
        });
    });

    it('should prevent editing events in the past', async () => {
        renderComponent();
        
        const editButtons = screen.getAllByTitle('Editar');
        fireEvent.click(editButtons[0]);

        const dateInput = screen.getByDisplayValue(/2025-02-15T/);
        fireEvent.change(dateInput, { target: { value: '2023-01-01T10:00' } });

        fireEvent.click(screen.getByText('Salvar'));

        await waitFor(() => {
            expect(screen.getByText('Não é possível cadastrar eventos no passado. Selecione uma data e hora futura.')).toBeInTheDocument();
        });

        expect(mockServices.updateEvent).not.toHaveBeenCalled();
    });

    it('should display formatted dates correctly', () => {
        renderComponent();
        
        expect(screen.getByText('15/02/2025')).toBeInTheDocument();
        expect(screen.getByText('15/03/2025')).toBeInTheDocument();
    });

    it('should show category and type labels correctly', () => {
        renderComponent();
        
        expect(screen.getByText('reuniao')).toBeInTheDocument();
        expect(screen.getByText('workshop')).toBeInTheDocument();
        expect(screen.getByText('presencial')).toBeInTheDocument();
        expect(screen.getByText('virtual')).toBeInTheDocument();
    });

    it('should validate required fields during editing', async () => {
        renderComponent();
        
        const editButtons = screen.getAllByTitle('Editar');
        fireEvent.click(editButtons[0]);

        const titleInput = screen.getByDisplayValue('Test Event');
        fireEvent.change(titleInput, { target: { value: '' } });

        fireEvent.click(screen.getByText('Salvar'));

        await waitFor(() => {
            expect(mockServices.updateEvent).not.toHaveBeenCalled();
        });
    });

    it('should handle events from different months correctly', () => {
        const eventJan = {
            ...mockEvent,
            id: 'event-jan',
            dateTime: '2025-01-15T10:00:00Z'
        };

        const eventDec = {
            ...mockEvent,
            id: 'event-dec',
            dateTime: '2025-12-15T10:00:00Z'
        };

        renderComponent([eventJan, mockEvent, mockEvent2, eventDec]);
        
        expect(screen.getByText('Janeiro/2025')).toBeInTheDocument();
        expect(screen.getByText('Fevereiro/2025')).toBeInTheDocument();
        expect(screen.getByText('Março/2025')).toBeInTheDocument();
        expect(screen.getByText('Dezembro/2025')).toBeInTheDocument();
    });

    it('should display event details correctly', () => {
        renderComponent();
        
        expect(screen.getByText('Test Event')).toBeInTheDocument();
        expect(screen.getByText('Test Description')).toBeInTheDocument();
        expect(screen.getByText('Test Location')).toBeInTheDocument();
        expect(screen.getByText('Por: Test Author')).toBeInTheDocument();
    });
});