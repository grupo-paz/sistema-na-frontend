import { render, screen } from '@testing-library/react';
import { MeetingCard } from '../meeting-card';
import { Meeting } from '../../../services/types';

describe('MeetingCard', () => {
    const mockMeeting: Meeting = {
        id: '1',
        category: 'Passos',
        dayOfWeek: 'Segunda-feira',
        time: '19:30',
        type: 'Presencial',
        roomOpener: 'João Silva',
        createdAt: '2025-01-01T00:00:00Z',
        updatedAt: '2025-01-01T00:00:00Z',
        authorId: '1'
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    const renderMeetingCard = (meeting: Meeting = mockMeeting) => {
        return render(<MeetingCard meeting={meeting} />);
    };

    it('should render meeting card correctly', () => {
        renderMeetingCard();

        expect(screen.getByText('Passos')).toBeInTheDocument();
        expect(screen.getByText('19:30')).toBeInTheDocument();
        expect(screen.getByText('Presencial')).toBeInTheDocument();
        expect(screen.getByText('Responsável por abrir: João Silva')).toBeInTheDocument();
    });

    it('should have correct CSS class structure', () => {
        const { container } = renderMeetingCard();

        expect(container.querySelector('.meeting-card')).toBeInTheDocument();
        expect(container.querySelector('.meeting-card-category')).toBeInTheDocument();
        expect(container.querySelector('.meeting-card-time')).toBeInTheDocument();
        expect(container.querySelector('.meeting-card-type')).toBeInTheDocument();
        expect(container.querySelector('.meeting-card-opener')).toBeInTheDocument();
    });

    it('should render meeting with different category', () => {
        const cultoMeeting: Meeting = {
            ...mockMeeting,
            category: 'Culto',
            roomOpener: 'Maria Santos'
        };

        renderMeetingCard(cultoMeeting);

        expect(screen.getByText('Culto')).toBeInTheDocument();
        expect(screen.getByText('Responsável por abrir: Maria Santos')).toBeInTheDocument();
    });

    it('should render meeting with different type', () => {
        const onlineMeeting: Meeting = {
            ...mockMeeting,
            type: 'Online'
        };

        renderMeetingCard(onlineMeeting);

        expect(screen.getByText('Online')).toBeInTheDocument();
    });

    it('should render meeting with different time', () => {
        const morningMeeting: Meeting = {
            ...mockMeeting,
            time: '09:00'
        };

        renderMeetingCard(morningMeeting);

        expect(screen.getByText('09:00')).toBeInTheDocument();
    });

    it('should render meeting with long opener name', () => {
        const longNameMeeting: Meeting = {
            ...mockMeeting,
            roomOpener: 'João Pedro da Silva Santos Oliveira'
        };

        renderMeetingCard(longNameMeeting);

        expect(screen.getByText('Responsável por abrir: João Pedro da Silva Santos Oliveira')).toBeInTheDocument();
    });

    it('should render meeting with minimal data', () => {
        const minimalMeeting: Meeting = {
            id: '2',
            category: 'A',
            dayOfWeek: 'Domingo',
            time: '10:00',
            type: 'B',
            roomOpener: 'C',
            createdAt: '2025-01-01T00:00:00Z',
            updatedAt: '2025-01-01T00:00:00Z',
            authorId: '2'
        };

        renderMeetingCard(minimalMeeting);

        expect(screen.getByText('A')).toBeInTheDocument();
        expect(screen.getByText('10:00')).toBeInTheDocument();
        expect(screen.getByText('B')).toBeInTheDocument();
        expect(screen.getByText('Responsável por abrir: C')).toBeInTheDocument();
    });

    it('should maintain structure even with empty strings', () => {
        const emptyMeeting: Meeting = {
            ...mockMeeting,
            category: '',
            time: '',
            type: '',
            roomOpener: ''
        };

        const { container } = renderMeetingCard(emptyMeeting);
        
        expect(container.querySelector('.meeting-card')).toBeInTheDocument();
        expect(container.querySelector('.meeting-card-category')).toBeInTheDocument();
        expect(container.querySelector('.meeting-card-time')).toBeInTheDocument();
        expect(container.querySelector('.meeting-card-type')).toBeInTheDocument();
        expect(container.querySelector('.meeting-card-opener')).toBeInTheDocument();
    });

    it('should render all meeting information fields', () => {
        renderMeetingCard();

        const { container } = renderMeetingCard();
        const categoryElement = container.querySelector('.meeting-card-category');
        const timeElement = container.querySelector('.meeting-card-time');
        const typeElement = container.querySelector('.meeting-card-type');
        const openerElement = container.querySelector('.meeting-card-opener');

        expect(categoryElement).toBeInTheDocument();
        expect(timeElement).toBeInTheDocument();
        expect(typeElement).toBeInTheDocument();
        expect(openerElement).toBeInTheDocument();
    });

    it('should format category text correctly', () => {
        renderMeetingCard();

        const categoryText = screen.getByText(/Passos/);
        expect(categoryText).toHaveTextContent('Passos');
    });

    it('should format opener text correctly', () => {
        renderMeetingCard();

        const openerText = screen.getByText(/Responsável por abrir:/);
        expect(openerText).toHaveTextContent('Responsável por abrir: João Silva');
    });
});
