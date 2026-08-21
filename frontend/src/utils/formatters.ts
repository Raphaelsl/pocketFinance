export const formatCurrency = (value: number, currency: string) => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: currency,
    }).format(value);
};

export const formatBalance = (value: number, currency: string) => {
    const formatted = formatCurrency(Math.abs(value), currency);
    if (value > 0) return `+ ${formatted}`;
    if (value < 0) return `- ${formatted}`;
    return formatted;
};