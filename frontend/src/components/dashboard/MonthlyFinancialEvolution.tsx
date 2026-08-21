import { DashboardResponse } from '../../types/dashboard';
import { formatCurrency } from '../../utils/formatters';

interface MonthlyFinancialEvolutionProps {
    evolution: DashboardResponse['monthlyEvolution'];
    currency: string;
}

export function MonthlyFinancialEvolution({ evolution, currency }: MonthlyFinancialEvolutionProps) {
    const allValues = evolution.flatMap((month) => [month.income, month.expense]);
    const maxValue = Math.max(0, ...allValues);

    const calculateHeight = (value: number) => {
        if (maxValue === 0) return 0;
        const percentage = (value / maxValue) * 100;
        return Math.min(percentage, 100);
    };

    return (
        <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Evolução Mensal</h2>


            <table className="sr-only">
                <caption>Evolução financeira mês a mês</caption>
                <thead>
                <tr>
                    <th scope="col">Mês</th>
                    <th scope="col">Receitas</th>
                    <th scope="col">Despesas</th>
                    <th scope="col">Saldo</th>
                </tr>
                </thead>
                <tbody>
                {evolution.map((data, index) => (
                    <tr key={index}>
                        <td>{data.month}</td>
                        <td>{formatCurrency(data.income, currency)}</td>
                        <td>{formatCurrency(data.expense, currency)}</td>
                        <td>{formatCurrency(data.balance, currency)}</td>
                    </tr>
                ))}
                </tbody>
            </table>


            <div className="relative w-full" aria-hidden="true">

                <div className="flex items-end justify-between gap-4 h-64 overflow-x-auto pb-2 border-b border-gray-200">

                    {evolution.map((data, index) => (

                        <div key={index} className="flex flex-col items-center gap-2 flex-shrink-0 min-w-[3rem] w-full max-w-[4rem]">


                            <div className="flex items-end justify-center gap-1 w-full h-48">


                                <div
                                    className="w-full bg-blue-600 rounded-t-sm transition-all duration-500 hover:opacity-80"
                                    style={{ height: `${calculateHeight(data.income)}%` }}
                                    title={`Receita: ${formatCurrency(data.income, currency)}`}
                                />


                                <div
                                    className="w-full rounded-t-sm transition-all duration-500 hover:opacity-80"
                                    style={{
                                        height: `${calculateHeight(data.expense)}%`,
                                        backgroundColor: '#ef4444',

                                        backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 4px, rgba(255,255,255,0.3) 4px, rgba(255,255,255,0.3) 8px)'
                                    }}
                                    title={`Despesa: ${formatCurrency(data.expense, currency)}`}
                                />

                            </div>


                            <span className="text-xs font-medium text-gray-500">
                {data.month}
              </span>

                        </div>
                    ))}
                </div>


                <div className="flex justify-center gap-6 mt-6">
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-blue-600 rounded-sm"></div>
                        <span className="text-sm text-gray-600 font-medium">Receitas</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div
                            className="w-4 h-4 rounded-sm"
                            style={{
                                backgroundColor: '#ef4444',
                                backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 4px, rgba(255,255,255,0.3) 4px, rgba(255,255,255,0.3) 8px)'
                            }}
                        ></div>
                        <span className="text-sm text-gray-600 font-medium">Despesas</span>
                    </div>
                </div>
            </div>

        </div>
    );
}