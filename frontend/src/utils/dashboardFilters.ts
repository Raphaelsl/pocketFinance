import { DashboardFilters } from '../types/dashboard';

export const DEFAULT_CURRENCY = 'BRL';

const ALLOWED_CURRENCIES = ['BRL', 'USD', 'EUR'] as const;

export function getPresetDateRange(months: number) {
    const now = new Date();

    const startDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - (months - 1), 1, 0, 0, 0));

    const endDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1, 0, 0, 0));

    return {
        start: startDate.toISOString(),
        end: endDate.toISOString()
    };
}

export const DEFAULT_FILTERS: DashboardFilters = {
    ...getPresetDateRange(6),
    currency: DEFAULT_CURRENCY,
};

function isValidDateRange(startStr: string, endStr: string): boolean {
    const start = new Date(startStr).getTime();
    const end = new Date(endStr).getTime();

    if (isNaN(start) || isNaN(end)) return false;
    if (start >= end) return false;

    const ONE_YEAR_MS = 366 * 24 * 60 * 60 * 1000;
    if (end - start > ONE_YEAR_MS) return false;

    return true;
}

export function parseFiltersFromURL(searchParams: URLSearchParams): DashboardFilters {
    const start = searchParams.get('start');
    const end = searchParams.get('end');


    const rawCurrency = searchParams.get('currency');
    const parsedCurrency = rawCurrency ? rawCurrency.toUpperCase() : '';


    const validCurrency = (ALLOWED_CURRENCIES as readonly string[]).includes(parsedCurrency)
        ? parsedCurrency
        : DEFAULT_CURRENCY;

    if (start && end && isValidDateRange(start, end)) {
        return {
            start,
            end,
            currency: validCurrency,
        };
    }


    return {
        ...DEFAULT_FILTERS,
        currency: validCurrency,
    };
}
