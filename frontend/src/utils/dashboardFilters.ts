import { DashboardFilters } from '../types/dashboard';

export const DEFAULT_CURRENCY = 'BRL';


export function getPresetDateRange(months: number): { start: string; end: string } {
    const now = new Date();


    const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    const startDate = new Date(now.getFullYear(), now.getMonth() - (months - 1), 1, 0, 0, 0);

    return {
        start: startDate.toISOString(),
        end: endDate.toISOString(),
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
    const currency = searchParams.get('currency');

    if (start && end && isValidDateRange(start, end)) {
        return {
            start,
            end,
            currency: currency || DEFAULT_CURRENCY,
        };
    }

    return DEFAULT_FILTERS;
}