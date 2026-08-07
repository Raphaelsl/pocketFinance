"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useDashboard } from '../../hooks/useDashboard';
import { formatCurrency, formatBalance } from '../../utils/formatters';


export default function Dashboard() {
    const [filters] = useState({
        start: '2026-01-01T00:00:00Z',
        end: '2026-12-31T23:59:59Z',
        currency: 'BRL',
    });

    const { data, isLoading, isError, refetch } = useDashboard(filters);

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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-24 bg-gray-200 rounded-lg animate-pulse" />
                    ))}
                </div>
            </div>
        );
    }

    if (data.summary.transactionCount === 0) {
        return (
            <div className="p-8 text-center">
                <h2 className="text-xl font-bold">Nenhuma movimentação neste período</h2>
                <p className="mb-4">Você ainda não registrou nenhuma receita ou despesa nestas datas.</p>
                <Link href="/transactions/new" className="text-blue-600 hover:underline">
                    Criar minha primeira transação
                </Link>
            </div>
        );
    }

    const { totalIncome, totalExpense, balance, transactionCount } = data.summary;

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Visão Geral</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

                {/* KPI: Receitas */}
                <div className="p-4 border border-gray-200 rounded-lg shadow-sm bg-white">
                    <h3 className="text-sm text-gray-500 font-medium">Receitas</h3>
                    <p className="mt-2 text-2xl font-bold text-gray-900">
                        {formatCurrency(totalIncome, filters.currency)}
                    </p>
                </div>

                {/* KPI: Despesas */}
                <div className="p-4 border border-gray-200 rounded-lg shadow-sm bg-white">
                    <h3 className="text-sm text-gray-500 font-medium">Despesas</h3>
                    <p className="mt-2 text-2xl font-bold text-gray-900">
                        {formatCurrency(totalExpense, filters.currency)}
                    </p>
                </div>

                {/* KPI: Saldo (Positivo/Negativo explícito) */}
                <div className="p-4 border border-gray-200 rounded-lg shadow-sm bg-white">
                    <h3 className="text-sm text-gray-500 font-medium">Saldo</h3>
                    <p className={`mt-2 text-2xl font-bold ${
                        balance > 0 ? 'text-green-600' : balance < 0 ? 'text-red-600' : 'text-gray-900'
                    }`}>
                        {formatBalance(balance, filters.currency)}
                    </p>
                </div>

                {/* KPI: Volume de Transações */}
                <div className="p-4 border border-gray-200 rounded-lg shadow-sm bg-white">
                    <h3 className="text-sm text-gray-500 font-medium">Transações</h3>
                    <p className="mt-2 text-2xl font-bold text-gray-900">
                        {transactionCount}
                    </p>
                </div>

            </div>
        </div>
    );
}