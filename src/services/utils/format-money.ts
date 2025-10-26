export const formatMoney = (amount: number): string => {
    return amount.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    });
};