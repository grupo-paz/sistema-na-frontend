import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import EventsForm from '../events-form';
import * as services from '../../../../../services';

jest.mock('../../../../../services', () => ({
    createEvent: jest.fn(),
    getEvents: jest.fn(),
}));

jest.mock('../../../../../components', () => ({
    Loading: () => <div data-testid="loading">Loading...</div>,
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
    dateTime: '2025-12-01T10:00:00Z',
    location: 'Test Location',
    type: 'presencial',
    category: 'reuniao',
    author: { id: 'author-1', name: 'Test Author' },
    authorId: 'author-1',
    createdAt: '2025-01-01T10:00:00Z',
    updatedAt: '2025-01-01T10:00:00Z'
};

describe('EventsForm', () => {
    const mockSetEvents = jest.fn();
    const mockFilterFutureEvents = jest.fn().mockResolvedValue([mockEvent]);

    beforeEach(() => {
        jest.clearAllMocks();
        mockServices.createEvent.mockResolvedValue(mockEvent);
        mockServices.getEvents.mockResolvedValue([mockEvent]);
    });

    const renderComponent = () => {
        return render(
            <EventsForm
                setEvents={mockSetEvents}
                filterFutureEvents={mockFilterFutureEvents}
            />
        );
    };

    it('should render form header', () => {
        renderComponent();
        expect(screen.getByText('Adicionar Novo Evento')).toBeInTheDocument();
    });

    it('should expand form when header is clicked', () => {
        renderComponent();

        const header = screen.getByText('Adicionar Novo Evento');
        fireEvent.click(header);

        expect(screen.getByLabelText('Título')).toBeInTheDocument();
        expect(screen.getByLabelText('Descrição')).toBeInTheDocument();
        expect(screen.getByLabelText('Data e Hora')).toBeInTheDocument();
        expect(screen.getByLabelText('Local')).toBeInTheDocument();
        expect(screen.getByLabelText('Categoria')).toBeInTheDocument();
        expect(screen.getByLabelText('Tipo')).toBeInTheDocument();
    });

    it('should fill form fields correctly', () => {
        renderComponent();

        fireEvent.click(screen.getByText('Adicionar Novo Evento'));

        const titleInput = screen.getByLabelText('Título') as HTMLInputElement;
        const descriptionInput = screen.getByLabelText('Descrição') as HTMLTextAreaElement;
        const locationInput = screen.getByLabelText('Local') as HTMLInputElement;

        fireEvent.change(titleInput, { target: { value: 'Test Event' } });
        fireEvent.change(descriptionInput, { target: { value: 'Test Description' } });
        fireEvent.change(locationInput, { target: { value: 'Test Location' } });

        expect(titleInput.value).toBe('Test Event');
        expect(descriptionInput.value).toBe('Test Description');
        expect(locationInput.value).toBe('Test Location');
    });

    it('should create event when form is submitted', async () => {
        renderComponent();

        fireEvent.click(screen.getByText('Adicionar Novo Evento'));

        fireEvent.change(screen.getByLabelText('Título'), { target: { value: 'Test Event' } });
        fireEvent.change(screen.getByLabelText('Descrição'), { target: { value: 'Test Description' } });
        fireEvent.change(screen.getByLabelText('Local'), { target: { value: 'Test Location' } });

        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 1);
        const dateTimeValue = futureDate.toISOString().slice(0, 16);

        fireEvent.change(screen.getByLabelText('Data e Hora'), { target: { value: dateTimeValue } });

        fireEvent.change(screen.getByLabelText('Categoria'), { target: { value: 'reuniao' } });
        fireEvent.change(screen.getByLabelText('Tipo'), { target: { value: 'presencial' } });

        fireEvent.click(screen.getByText('Criar Evento'));

        expect(mockServices.createEvent).toHaveBeenCalledWith({
            title: 'Test Event',
            description: 'Test Description',
            location: 'Test Location',
            dateTime: expect.any(String),
            category: 'reuniao',
            type: 'presencial',
        });


    });

    it('should show loading state during submission', async () => {
        const delayedResolve = (value: typeof mockEvent): Promise<typeof mockEvent> => new Promise((resolve) => {
            setTimeout(() => resolve(value), 100);
        });
        mockServices.createEvent.mockImplementation(() => delayedResolve(mockEvent));

        renderComponent();

        fireEvent.click(screen.getByText('Adicionar Novo Evento'));

        fireEvent.change(screen.getByLabelText('Título'), { target: { value: 'Test Event' } });
        fireEvent.change(screen.getByLabelText('Descrição'), { target: { value: 'Test Description' } });
        fireEvent.change(screen.getByLabelText('Local'), { target: { value: 'Test Location' } });

        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 1);
        fireEvent.change(screen.getByLabelText('Data e Hora'), { target: { value: futureDate.toISOString().slice(0, 16) } });
        fireEvent.change(screen.getByLabelText('Categoria'), { target: { value: 'reuniao' } });
        fireEvent.change(screen.getByLabelText('Tipo'), { target: { value: 'presencial' } });

        fireEvent.click(screen.getByText('Criar Evento'));

        expect(screen.getByTestId('loading')).toBeInTheDocument();
        expect(screen.getByText('Criando...')).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
        });
    });

    it('should handle API error', async () => {
        mockServices.createEvent.mockRejectedValue(new Error('API Error'));

        renderComponent();

        fireEvent.click(screen.getByText('Adicionar Novo Evento'));

        fireEvent.change(screen.getByLabelText('Título'), { target: { value: 'Test Event' } });
        fireEvent.change(screen.getByLabelText('Descrição'), { target: { value: 'Test Description' } });
        fireEvent.change(screen.getByLabelText('Local'), { target: { value: 'Test Location' } });

        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 1);
        fireEvent.change(screen.getByLabelText('Data e Hora'), { target: { value: futureDate.toISOString().slice(0, 16) } });
        fireEvent.change(screen.getByLabelText('Categoria'), { target: { value: 'reuniao' } });
        fireEvent.change(screen.getByLabelText('Tipo'), { target: { value: 'presencial' } });

        fireEvent.click(screen.getByText('Criar Evento'));

        await waitFor(() => {
            expect(screen.getByText('API Error')).toBeInTheDocument();
        });
    });

    it('should update events list after creation', async () => {
        renderComponent();

        fireEvent.click(screen.getByText('Adicionar Novo Evento'));

        fireEvent.change(screen.getByLabelText('Título'), { target: { value: 'Test Event' } });
        fireEvent.change(screen.getByLabelText('Descrição'), { target: { value: 'Test Description' } });
        fireEvent.change(screen.getByLabelText('Local'), { target: { value: 'Test Location' } });

        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 1);
        fireEvent.change(screen.getByLabelText('Data e Hora'), { target: { value: futureDate.toISOString().slice(0, 16) } });
        fireEvent.change(screen.getByLabelText('Categoria'), { target: { value: 'reuniao' } });
        fireEvent.change(screen.getByLabelText('Tipo'), { target: { value: 'presencial' } });

        fireEvent.click(screen.getByText('Criar Evento'));

        await waitFor(() => {
            expect(mockServices.getEvents).toHaveBeenCalled();
            expect(mockFilterFutureEvents).toHaveBeenCalled();
            expect(mockSetEvents).toHaveBeenCalled();
        });
    });
});