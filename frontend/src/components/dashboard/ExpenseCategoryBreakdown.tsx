import { DashboardResponse } from '../../types/dashboard';
import { formatCurrency } from '../../utils/formatters';

interface ExpenseCategoryBreakdownProps {
    breakdown: DashboardResponse['categoryBreakdown'];
    currency: string;
}

export function ExpenseCategoryBreakdown({ breakdown, currency }: ExpenseCategoryBreakdownProps) {
    const expenseBreakdown = breakdown.filter((item) => item.amount > 0);
    const sortedBreakdown = [...expenseBreakdown].sort((a, b) => b.amount - a.amount);
    const totalExpenses = sortedBreakdown.reduce((sum, item) => sum + item.amount, 0);

    if (sortedBreakdown.length === 0) {
        return (
            <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm text-center">
                <h2 className="text-lg font-bold text-gray-900 mb-2">Despesas por Categoria</h2>
                <p className="text-gray-500 text-sm">Nenhuma despesa registrada neste período.</p>
            </div>
        );
    }

    return (
        <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Despesas por Categoria</h2>

            <div className="space-y-5">
                {sortedBreakdown.map((item, index) => {

                    const name = item.category || 'Sem categoria';


                    const percentage = totalExpenses > 0 ? (item.amount / totalExpenses) * 100 : 0;

                    return (
                        <div key={item.category || `uncategorized-${index}`}>


                            <div className="flex justify-between items-center mb-1.5 gap-4">

                                <span className="text-sm font-medium text-gray-700 truncate" title={name}>
                  {name}
                </span>

                                {/* shrink-0*/}
                                <span className="text-sm font-bold text-gray-900 shrink-0">
                  {formatCurrency(item.amount, currency)}
                </span>
                            </div>


                            <div className="w-full bg-gray-100 rounded-full h-2.5" aria-hidden="true">
                                <div
                                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"

                                    style={{ width: `${Math.min(percentage, 100)}%` }}
                                />
                            </div>

                        </div>
                    );
                })}
            </div>
        </div>
    );
}