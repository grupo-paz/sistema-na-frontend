import { filterFutureEvents } from '../filter-future-events';
import { Event } from '../../types';

describe('filterFutureEvents', () => {
    const mockPastEvent: Event = {
        id: '1',
        title: 'Past Event',
        description: 'Event that already happened',
        dateTime: '2020-01-15T10:00:00Z',
        location: 'Location 1',
        type: 'Lecture',
        category: 'Academic',
        createdAt: '2020-01-01T00:00:00Z',
        updatedAt: '2020-01-01T00:00:00Z',
        authorId: '1',
        author: { name: 'Admin' }
    };

    const mockFutureEvent: Event = {
        id: '2',
        title: 'Future Event',
        description: 'Event that will happen',
        dateTime: '2030-12-25T15:00:00Z',
        location: 'Location 2',
        type: 'Workshop',
        category: 'Cultural',
        createdAt: '2025-01-01T00:00:00Z',
        updatedAt: '2025-01-01T00:00:00Z',
        authorId: '2',
        author: { name: 'Organizer' }
    };

    const mockAnotherFutureEvent: Event = {
        id: '3',
        title: 'Another Future Event',
        description: 'Another future event',
        dateTime: '2026-06-10T09:30:00Z',
        location: 'Location 3',
        type: 'Seminar',
        category: 'Technical',
        createdAt: '2025-01-01T00:00:00Z',
        updatedAt: '2025-01-01T00:00:00Z',
        authorId: '3',
        author: { name: 'Speaker' }
    };

    beforeEach(() => {
        jest.useFakeTimers();
        jest.setSystemTime(new Date('2025-11-01T12:00:00Z'));
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it('should return only future events', async () => {
        const events = [mockPastEvent, mockFutureEvent, mockAnotherFutureEvent];
        
        const result = await filterFutureEvents(events);
        
        expect(result).toHaveLength(2);
        expect(result).toContain(mockFutureEvent);
        expect(result).toContain(mockAnotherFutureEvent);
        expect(result).not.toContain(mockPastEvent);
    });

    it('should return empty array when there are no future events', async () => {
        const events = [mockPastEvent];
        
        const result = await filterFutureEvents(events);
        
        expect(result).toHaveLength(0);
        expect(result).toEqual([]);
    });

    it('should return all events when all are future', async () => {
        const events = [mockFutureEvent, mockAnotherFutureEvent];
        
        const result = await filterFutureEvents(events);
        
        expect(result).toHaveLength(2);
        expect(result).toEqual(events);
    });

    it('should return empty array when input list is empty', async () => {
        const events: Event[] = [];
        
        const result = await filterFutureEvents(events);
        
        expect(result).toHaveLength(0);
        expect(result).toEqual([]);
    });

    it('should filter events with dates very close to the present', async () => {
        const closeEvents: Event[] = [
            {
                ...mockPastEvent,
                id: '4',
                dateTime: '2025-10-31T23:59:59Z'
            },
            {
                ...mockFutureEvent,
                id: '5',
                dateTime: '2025-11-01T12:00:01Z'
            }
        ];
        
        const result = await filterFutureEvents(closeEvents);
        
        expect(result).toHaveLength(1);
        expect(result[0].id).toBe('5');
    });

    it('should keep the original order of future events', async () => {
        const events = [mockPastEvent, mockFutureEvent, mockAnotherFutureEvent];
        
        const result = await filterFutureEvents(events);
        
        expect(result[0]).toBe(mockFutureEvent);
        expect(result[1]).toBe(mockAnotherFutureEvent);
    });

    it('should handle invalid date format gracefully', async () => {
        const invalidDateEvent: Event = {
            ...mockFutureEvent,
            id: '6',
            dateTime: 'invalid-date'
        };
        
        const events = [invalidDateEvent, mockFutureEvent];
        
        const result = await filterFutureEvents(events);
        
        expect(result).toHaveLength(1);
        expect(result[0]).toBe(mockFutureEvent);
    });
});