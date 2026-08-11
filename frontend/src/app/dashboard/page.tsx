"use client";

import Link from 'next/link';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useDashboard } from '../../hooks/useDashboard';
import { formatCurrency, formatBalance } from '../../utils/formatters';
import { parseFiltersFromURL, getPresetDateRange } from '../../utils/dashboardFilters';
import { ExpenseCategoryBreakdown } from '../../components/dashboard/ExpenseCategoryBreakdown';
import { MonthlyFinancialEvolution } from '../../components/dashboard/MonthlyFinancialEvolution';

export default function Dashboard() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();


    const filters = parseFiltersFromURL(searchParams);



    const { data, isLoading, isError, refetch, isFetching } = useDashboard(filters);


    const handlePeriodChange = (months: number) => {
        const { start, end } = getPresetDateRange(months);
        const params = new URLSearchParams(searchParams.toString());
        params.set('start', start);
        params.set('end', end);
        router.push(`${pathname}?${params.toString()}`);
    };


    const handleCurrencyChange = (currency: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('currency', currency);
        router.push(`${pathname}?${params.toString()}`);
    };

    if (isError) {
        return (
            <div className="p-8 text-center text-gray-600">
                <h2 className="text-xl font-bold">Ops! Não foi possível carregar o painel.</h2>
                <p>Ocorreu um erro ao buscar suas informações financeiras.</p>
                <button
                    onClick={() => refetch()}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                    Tentar Novamente
                </button>
            </div>
        );
    }


    if (isLoading || !data) {
        return (
            <div className="p-8 max-w-6xl mx-auto">
                <h1 className="text-2xl font-bold mb-4">Visão Geral</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-24 bg-gray-200 rounded-lg animate-pulse" />
                    ))}
                </div>
            </div>
        );
    }

    const { totalIncome, totalExpense, balance, transactionCount } = data.summary;

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <h1 className="text-2xl font-bold">Visão Geral</h1>

                {/* Controles de Filtro */}
                <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">

                    {/* Presets de Período */}
                    <div className="flex bg-gray-100 rounded-lg p-1">
                        {[
                            { label: 'Mês Atual', value: 1 },
                            { label: '3 Meses', value: 3 },
                            { label: '6 Meses', value: 6 },
                            { label: '1 Ano', value: 12 },
                        ].map((preset) => {
                            // Lógica simples para destacar o botão ativo comparando com a URL
                            const isActive = searchParams.get('start') === getPresetDateRange(preset.value).start;
                            return (
                                <button
                                    key={preset.value}
                                    onClick={() => handlePeriodChange(preset.value)}
                                    className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                                        isActive ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600 hover:text-gray-900'
                                    }`}
                                >
                                    {preset.label}
                                </button>
                            );
                        })}
                    </div>

                    {/* Controle de Moeda */}
                    <select
                        value={filters.currency}
                        onChange={(e) => handleCurrencyChange(e.target.value)}
                        className="px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="BRL">BRL (R$)</option>
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                    </select>
                </div>
            </div>

            {data.summary.transactionCount === 0 ? (
                <div className="py-12 text-center bg-white border border-gray-200 rounded-lg shadow-sm">
                    <h2 className="text-xl font-bold text-gray-800">Nenhuma movimentação neste período</h2>
                    <p className="mt-2 text-gray-500 mb-4">Você ainda não registrou nenhuma receita ou despesa nestas datas.</p>
                    <Link href="/transactions/new" className="text-blue-600 hover:underline font-medium">
                        Criar minha primeira transação
                    </Link>
                </div>
            ) : (
                <>
                    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 transition-opacity duration-200 ${isFetching ? 'opacity-50' : 'opacity-100'}`}>

                        <div className="p-4 border border-gray-200 rounded-lg shadow-sm bg-white">
                            <h3 className="text-sm text-gray-500 font-medium">Receitas</h3>
                            <p className="mt-2 text-2xl font-bold text-gray-900">
                                {formatCurrency(totalIncome, filters.currency)}
                            </p>
                        </div>

                        <div className="p-4 border border-gray-200 rounded-lg shadow-sm bg-white">
                            <h3 className="text-sm text-gray-500 font-medium">Despesas</h3>
                            <p className="mt-2 text-2xl font-bold text-gray-900">
                                {formatCurrency(totalExpense, filters.currency)}
                            </p>
                        </div>

                        <div className="p-4 border border-gray-200 rounded-lg shadow-sm bg-white">
                            <h3 className="text-sm text-gray-500 font-medium">Saldo</h3>
                            <p className={`mt-2 text-2xl font-bold ${
                                balance > 0 ? 'text-green-600' : balance < 0 ? 'text-red-600' : 'text-gray-900'
                            }`}>
                                {formatBalance(balance, filters.currency)}
                            </p>
                        </div>

                        <div className="p-4 border border-gray-200 rounded-lg shadow-sm bg-white">
                            <h3 className="text-sm text-gray-500 font-medium">Transações</h3>
                            <p className="mt-2 text-2xl font-bold text-gray-900">
                                {transactionCount}
                            </p>
                        </div>

                    </div>


                    {/* Breakdown de Categorias */}
                    <div className={`mt-6 transition-opacity duration-200 ${isFetching ? 'opacity-50' : 'opacity-100'}`}>
                        <ExpenseCategoryBreakdown
                            breakdown={data.categoryBreakdown}
                            currency={filters.currency}
                        />
                    </div>
                    {/* Evolução Mensal */}
                    <div className={`mt-6 transition-opacity duration-200 ${isFetching ? 'opacity-50' : 'opacity-100'}`}>
                        <MonthlyFinancialEvolution
                            evolution={data.monthlyEvolution}
                            currency={filters.currency}
                        />
                    </div>
                </>
            )}
        </div>
    );
}