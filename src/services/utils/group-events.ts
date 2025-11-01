import { Event } from "../types";

interface MonthGroup {
    key: string;
    label: string;
    events: Event[];
}

/**
 * Agrupa eventos por mês e ano
 * @param events Array de eventos
 * @returns Array de grupos ordenados por mês/ano
 */
export const groupEventsByMonth = (events: Event[]): MonthGroup[] => {
    const grouped: Record<string, Event[]> = {};

    for (const event of events) {
        const date = new Date(event.dateTime);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

        if (!grouped[monthKey]) {
            grouped[monthKey] = [];
        }
        grouped[monthKey].push(event);
    }

    // Ordenar eventos dentro de cada mês por data
    for (const monthKey of Object.keys(grouped)) {
        grouped[monthKey].sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());
    }

    // Converter para array e ordenar por data
    return Object.keys(grouped)
        .sort((a, b) => a.localeCompare(b))
        .map(key => {
            const firstEvent = grouped[key][0];
            const date = new Date(firstEvent.dateTime);
            const label = `${date.toLocaleDateString('pt-BR', {
                month: 'long'
            }).charAt(0).toUpperCase() + date.toLocaleDateString('pt-BR', {
                month: 'long'
            }).slice(1)}/${date.getFullYear()}`;
            
            return {
                key,
                label,
                events: grouped[key]
            };
        });
};