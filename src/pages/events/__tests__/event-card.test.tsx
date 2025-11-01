import { render, screen } from '@testing-library/react';
import { EventCard } from '../event-card';
import { Event } from '../../../services';

const mockFormatDate = jest.fn();

jest.mock('../../../services', () => ({
    formatDate: (...args: any[]) => mockFormatDate(...args)
}));

describe('EventCard', () => {
    const mockEvent: Event = {
        id: '1',
        title: 'Test Event',
        description: 'This is a test description for the event',
        dateTime: '2025-12-25T15:00:00Z',
        location: 'Main Auditorium',
        type: 'Lecture',
        category: 'Academic',
        createdAt: '2025-01-01T00:00:00Z',
        updatedAt: '2025-01-01T00:00:00Z',
        authorId: '1',
        author: { name: 'Dr. John Silva' }
    };

    beforeEach(() => {
        jest.clearAllMocks();
        mockFormatDate.mockReturnValue('December 25, 2025, 15:00');
    });

    const renderEventCard = (event: Event = mockEvent) => {
        return render(<EventCard event={event} />);
    };

    it('should render event card correctly', () => {
        renderEventCard();

        expect(screen.getByText('Test Event')).toBeInTheDocument();
        expect(screen.getByText('This is a test description for the event')).toBeInTheDocument();
        expect(screen.getByText('Academic')).toBeInTheDocument();
        expect(screen.getByText('Main Auditorium')).toBeInTheDocument();
        expect(screen.getByText('Lecture')).toBeInTheDocument();
    });

    it('should call formatDate with event date', () => {
        renderEventCard();

        expect(mockFormatDate).toHaveBeenCalledWith('2025-12-25T15:00:00Z');
        expect(screen.getByText('December 25, 2025, 15:00')).toBeInTheDocument();
    });

    it('should render all SVG icons', () => {
        const { container } = renderEventCard();

        const svgElements = container.querySelectorAll('svg.event-icon');
        expect(svgElements).toHaveLength(3);
    });

    it('should have correct CSS class structure', () => {
        const { container } = renderEventCard();

        expect(container.querySelector('.event-card')).toBeInTheDocument();
        expect(container.querySelector('.event-content')).toBeInTheDocument();
        expect(container.querySelector('.event-header')).toBeInTheDocument();
        expect(container.querySelector('.event-title')).toBeInTheDocument();
        expect(container.querySelector('.event-category')).toBeInTheDocument();
        expect(container.querySelector('.event-description')).toBeInTheDocument();
        expect(container.querySelector('.event-details')).toBeInTheDocument();
        expect(container.querySelector('.event-datetime')).toBeInTheDocument();
        expect(container.querySelector('.event-location')).toBeInTheDocument();
        expect(container.querySelector('.event-type')).toBeInTheDocument();
    });

    it('should render event with minimal data', () => {
        const minimalEvent: Event = {
            id: '2',
            title: 'Minimal Title',
            description: 'Minimal description',
            dateTime: '2025-01-01T10:00:00Z',
            location: 'Location',
            type: 'Type',
            category: 'Category',
            createdAt: '2025-01-01T00:00:00Z',
            updatedAt: '2025-01-01T00:00:00Z',
            authorId: '1',
            author: { name: 'Author' }
        };

        renderEventCard(minimalEvent);

        expect(screen.getByText('Minimal Title')).toBeInTheDocument();
        expect(screen.getByText('Minimal description')).toBeInTheDocument();
        expect(screen.getByText('Location')).toBeInTheDocument();
        expect(screen.getByText('Type')).toBeInTheDocument();
        expect(screen.getByText('Category')).toBeInTheDocument();
    });

    it('should render event with long texts', () => {
        const longTextEvent: Event = {
            ...mockEvent,
            title: 'This is a very long title to test how the component behaves with extensive texts',
            description: 'This is a very long description that can have multiple lines and needs to be tested to ensure the layout does not break when there is a lot of text to display in the event card',
            location: 'Main Auditorium of the International Convention Center of São Paulo'
        };

        renderEventCard(longTextEvent);

        expect(screen.getByText(longTextEvent.title)).toBeInTheDocument();
        expect(screen.getByText(longTextEvent.description)).toBeInTheDocument();
        expect(screen.getByText(longTextEvent.location)).toBeInTheDocument();
    });

    it('should render with different types and categories', () => {
        const workshopEvent: Event = {
            ...mockEvent,
            type: 'Workshop',
            category: 'Technical'
        };

        renderEventCard(workshopEvent);

        expect(screen.getByText('Workshop')).toBeInTheDocument();
        expect(screen.getByText('Technical')).toBeInTheDocument();
    });

    it('should maintain structure even with empty strings', () => {
        const emptyEvent: Event = {
            ...mockEvent,
            title: '',
            description: '',
            location: '',
            type: '',
            category: ''
        };

        renderEventCard(emptyEvent);

        const { container } = renderEventCard(emptyEvent);
        expect(container.querySelector('.event-card')).toBeInTheDocument();
        expect(container.querySelector('.event-title')).toBeInTheDocument();
        expect(container.querySelector('.event-description')).toBeInTheDocument();
    });

    it('should call formatDate only once per render', () => {
        renderEventCard();

        expect(mockFormatDate).toHaveBeenCalledTimes(1);
    });

    it('should render correctly when formatDate returns empty string', () => {
        mockFormatDate.mockReturnValue('');
        
        const { container } = renderEventCard();

        const dateTimeSpan = container.querySelector('.event-datetime span');
        expect(dateTimeSpan).toBeInTheDocument();
        expect(dateTimeSpan?.textContent).toBe('');
    });
});