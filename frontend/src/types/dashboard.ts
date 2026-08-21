export interface DashboardFilters {
    start: string;
    end: string;
    currency: string;
}

export interface DashboardSummary {
    totalIncome: number;
    totalExpense: number;
    balance: number;
    transactionCount: number;
}

export interface CategoryBreakdown {
    category: string;
    amount: number;
}

export interface MonthlyEvolution {
    month: string; 
    income: number;
    expense: number;
    balance: number;
}

export interface DashboardResponse {
    summary: DashboardSummary;
    categoryBreakdown: CategoryBreakdown[];
    monthlyEvolution: MonthlyEvolution[];
}