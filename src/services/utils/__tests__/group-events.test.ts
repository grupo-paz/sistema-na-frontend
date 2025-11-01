import { groupEventsByMonth } from '../group-events';
import { Event } from '../../types';

describe('groupEventsByMonth', () => {
    const mockEvents: Event[] = [
        {
            id: '1',
            title: 'Evento Janeiro',
            description: 'Descrição',
            dateTime: '2025-01-15T10:00:00Z',
            location: 'Local 1',
            type: 'Palestra',
            category: 'Acadêmico',
            createdAt: '2025-01-01T00:00:00Z',
            updatedAt: '2025-01-01T00:00:00Z',
            authorId: '1',
            author: { name: 'Admin' }
        },
        {
            id: '2',
            title: 'Evento Janeiro 2',
            description: 'Descrição',
            dateTime: '2025-01-20T14:00:00Z',
            location: 'Local 2',
            type: 'Workshop',
            category: 'Cultural',
            createdAt: '2025-01-01T00:00:00Z',
            updatedAt: '2025-01-01T00:00:00Z',
            authorId: '1',
            author: { name: 'Admin' }
        },
        {
            id: '3',
            title: 'Evento Fevereiro',
            description: 'Descrição',
            dateTime: '2025-02-10T16:00:00Z',
            location: 'Local 3',
            type: 'Reunião',
            category: 'Esportivo',
            createdAt: '2025-01-01T00:00:00Z',
            updatedAt: '2025-01-01T00:00:00Z',
            authorId: '1',
            author: { name: 'Admin' }
        }
    ];

    it('should group events by month correctly', () => {
        const result = groupEventsByMonth(mockEvents);

        expect(result).toHaveLength(2);
        expect(result[0].key).toBe('2025-01');
        expect(result[0].label).toBe('Janeiro/2025');
        expect(result[0].events).toHaveLength(2);
        expect(result[1].key).toBe('2025-02');
        expect(result[1].label).toBe('Fevereiro/2025');
        expect(result[1].events).toHaveLength(1);
    });

    it('should sort events within each month by date', () => {
        const result = groupEventsByMonth(mockEvents);
        
        const januaryEvents = result[0].events;
        expect(januaryEvents[0].dateTime).toBe('2025-01-15T10:00:00Z');
        expect(januaryEvents[1].dateTime).toBe('2025-01-20T14:00:00Z');
    });

    it('should sort month groups chronologically', () => {
        const result = groupEventsByMonth(mockEvents);
        
        expect(result[0].key).toBe('2025-01');
        expect(result[1].key).toBe('2025-02');
    });

    it('should handle empty events array', () => {
        const result = groupEventsByMonth([]);
        expect(result).toEqual([]);
    });

    it('should handle single event', () => {
        const singleEvent = [mockEvents[0]];
        const result = groupEventsByMonth(singleEvent);
        
        expect(result).toHaveLength(1);
        expect(result[0].events).toHaveLength(1);
        expect(result[0].events[0].id).toBe('1');
    });

    it('should handle events from different years', () => {
        const eventsWithDifferentYears = [
            ...mockEvents,
            {
                id: '4',
                title: 'Evento 2026',
                description: 'Descrição',
                dateTime: '2026-01-15T10:00:00Z',
                location: 'Local 4',
                type: 'Palestra',
                category: 'Acadêmico',
                createdAt: '2026-01-01T00:00:00Z',
                updatedAt: '2026-01-01T00:00:00Z',
                authorId: '1',
                author: { name: 'Admin' }
            }
        ];

        const result = groupEventsByMonth(eventsWithDifferentYears);
        
        expect(result).toHaveLength(3);
        expect(result[2].key).toBe('2026-01');
        expect(result[2].label).toBe('Janeiro/2026');
    });

    it('should capitalize month names correctly', () => {
        const result = groupEventsByMonth(mockEvents);
        
        expect(result[0].label).toBe('Janeiro/2025');
        expect(result[1].label).toBe('Fevereiro/2025');
    });
});