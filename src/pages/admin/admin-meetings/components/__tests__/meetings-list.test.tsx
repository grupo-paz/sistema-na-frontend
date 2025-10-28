import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import MeetingsList from '../meetings-list';
import * as services from '../../../../../services';

jest.mock('../../../../../services', () => ({
    updateMeeting: jest.fn(),
    getMeetings: jest.fn(),
}));

jest.mock('../../../../../components', () => ({
    Loading: () => <div data-testid="loading">Loading...</div>,
}));

const mockServices = services as jest.Mocked<typeof services>;
const mockSetMeetings = jest.fn();
const mockOnConfirmDelete = jest.fn();

const mockMeeting = {
    id: 'meeting-1',
    dayOfWeek: 'Segunda-feira',
    time: '10:00',
    type: 'Aberta',
    category: 'Tradicional',
    roomOpener: 'João Silva',
    createdAt: '2025-10-01T10:00:00Z',
    updatedAt: '2025-10-01T10:00:00Z',
    authorId: 'author-1',
    author: { name: 'Test Author' }
};

describe('MeetingsList', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockServices.updateMeeting.mockResolvedValue(mockMeeting);
        mockServices.getMeetings.mockResolvedValue([mockMeeting]);
    });

    const renderList = (meetings = [mockMeeting]) => {
        return render(
            <MeetingsList
                meetings={meetings}
                setMeetings={mockSetMeetings}
                onConfirmDelete={mockOnConfirmDelete}
            />
        );
    };

    it('should render meetings list', () => {
        renderList();
        
        expect(screen.getByText('Reuniões Cadastradas')).toBeInTheDocument();
        expect(screen.getByText('Segunda-feira - 10:00')).toBeInTheDocument();
        expect(screen.getByText('Tradicional')).toBeInTheDocument();
        expect(screen.getByText('Aberta')).toBeInTheDocument();
        expect(screen.getByText('Responsável por abrir: João Silva')).toBeInTheDocument();
    });

    it('should show empty state when no meetings', () => {
        renderList([]);
        
        expect(screen.getByText('Nenhuma reunião cadastrada ainda.')).toBeInTheDocument();
    });

    it('should handle edit meeting', () => {
        renderList();
        
        const editButton = screen.getByTitle('Editar');
        fireEvent.click(editButton);
        
        expect(screen.getByLabelText('Dia da Semana')).toBeInTheDocument();
        expect(screen.getByLabelText('Horário')).toBeInTheDocument();
        expect(screen.getByLabelText('Categoria')).toBeInTheDocument();
        expect(screen.getByLabelText('Tipo')).toBeInTheDocument();
        expect(screen.getByLabelText('Responsável por Abrir a Sala')).toBeInTheDocument();
    });

    it('should handle delete meeting', () => {
        renderList();
        
        const deleteButton = screen.getByTitle('Remover');
        fireEvent.click(deleteButton);
        
        expect(mockOnConfirmDelete).toHaveBeenCalledWith('meeting-1');
    });

    it('should update meeting successfully', async () => {
        renderList();
        
        const editButton = screen.getByTitle('Editar');
        fireEvent.click(editButton);
        
        fireEvent.change(screen.getByLabelText('Dia da Semana'), { target: { value: 'Terça-feira' } });
        fireEvent.change(screen.getByLabelText('Horário'), { target: { value: '14:00' } });
        
        fireEvent.click(screen.getByText('Salvar'));
        
        await waitFor(() => {
            expect(mockServices.updateMeeting).toHaveBeenCalledWith('meeting-1', {
                dayOfWeek: 'Terça-feira',
                time: '14:00',
                type: 'Aberta',
                category: 'Tradicional',
                roomOpener: 'João Silva',
            });
        });

        await waitFor(() => {
            expect(screen.getByText('Reunião atualizada com sucesso!')).toBeInTheDocument();
        });
    });

    it('should show validation error when fields are empty', async () => {
        renderList();
        
        const editButton = screen.getByTitle('Editar');
        fireEvent.click(editButton);
        
        fireEvent.change(screen.getByLabelText('Dia da Semana'), { target: { value: '' } });
        
        fireEvent.click(screen.getByText('Salvar'));
        
        await waitFor(() => {
            expect(screen.getByText('Todos os campos são obrigatórios.')).toBeInTheDocument();
        });
    });

    it('should cancel edit', () => {
        renderList();
        
        const editButton = screen.getByTitle('Editar');
        fireEvent.click(editButton);
        
        fireEvent.click(screen.getByText('Cancelar'));
        
        expect(screen.getByText('Segunda-feira - 10:00')).toBeInTheDocument();
        expect(screen.queryByLabelText('Dia da Semana')).not.toBeInTheDocument();
    });
});
