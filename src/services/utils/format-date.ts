export const formatDate = (isoDate: string): string => {
    try {
        const date = new Date(isoDate);
        if (Number.isNaN(date.getTime())) {
            return isoDate;
        }
        return date.toLocaleString('pt-BR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            timeZone: 'America/Sao_Paulo'
        });
    } catch {
        return isoDate;
    }
};