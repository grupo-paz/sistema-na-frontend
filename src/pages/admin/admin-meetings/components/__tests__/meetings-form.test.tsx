import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import MeetingsForm from '../meetings-form';
import * as services from '../../../../../services';

jest.mock('../../../../../services', () => ({
    createMeeting: jest.fn(),
    getMeetings: jest.fn(),
}));

jest.mock('../../../../../components', () => ({
    Loading: () => <div data-testid="loading">Loading...</div>,
}));

const mockServices = services as jest.Mocked<typeof services>;
const mockSetMeetings = jest.fn();

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

describe('MeetingsForm', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockServices.createMeeting.mockResolvedValue(mockMeeting);
        mockServices.getMeetings.mockResolvedValue([mockMeeting]);
    });

    it('should render meetings form', () => {
        render(<MeetingsForm setMeetings={mockSetMeetings} />);
        
        expect(screen.getByText('Adicionar Nova Reunião')).toBeInTheDocument();
        
        fireEvent.click(screen.getByText('Adicionar Nova Reunião'));
        
        expect(screen.getByLabelText('Dia da Semana')).toBeInTheDocument();
        expect(screen.getByLabelText('Horário')).toBeInTheDocument();
        expect(screen.getByLabelText('Categoria')).toBeInTheDocument();
        expect(screen.getByLabelText('Tipo')).toBeInTheDocument();
        expect(screen.getByLabelText('Responsável por Abrir a Sala')).toBeInTheDocument();
    });

    it('should expand and collapse form', () => {
        render(<MeetingsForm setMeetings={mockSetMeetings} />);
        
        expect(screen.queryByLabelText('Dia da Semana')).not.toBeInTheDocument();
        
        fireEvent.click(screen.getByText('Adicionar Nova Reunião'));
        expect(screen.getByLabelText('Dia da Semana')).toBeInTheDocument();
        
        fireEvent.click(screen.getByText('Adicionar Nova Reunião'));
        expect(screen.queryByLabelText('Dia da Semana')).not.toBeInTheDocument();
    });

    it('should have submit button when form is expanded', () => {
        render(<MeetingsForm setMeetings={mockSetMeetings} />);
        
        fireEvent.click(screen.getByText('Adicionar Nova Reunião'));
        
        expect(screen.getByText('Criar Reunião')).toBeInTheDocument();
    });
});
