import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '../services/dashboardService';
import { DashboardFilters } from '../types/dashboard';

export function useDashboard(filters: DashboardFilters) {
    return useQuery({

        queryKey: ['dashboard', filters],
        queryFn: () => dashboardService.getDashboard(filters),
        staleTime: 1000 * 60 * 5,
    });
}