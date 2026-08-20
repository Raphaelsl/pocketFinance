import { DashboardResponse, DashboardFilters } from '../types/dashboard';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export const dashboardService = {
    getDashboard: async (filters: DashboardFilters): Promise<DashboardResponse> => {
        const params = new URLSearchParams({
            start: filters.start,
            end: filters.end,
            currency: filters.currency,
        });

        const response = await fetch(`${API_URL}/api/dashboard?${params.toString()}`);

        if (!response.ok) {

            const errorBody = await response.json().catch(() => null);


            throw new Error(errorBody?.message || 'Falha ao buscar dados do dashboard');
        }

        return response.json();
    },
};