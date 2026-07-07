import {Transaction, TransactionType} from "@/types/transaction";
import Link from 'next/link';
interface Props{
    transaction: Transaction;// exige obrigatoriamente um obj Transaction
}

function getDisplayCurrency(currency?: string | null): string {
    const normalizedCurrency = currency?.trim().toUpperCase();

    if (!normalizedCurrency || !/^[A-Z]{3}$/.test(normalizedCurrency)) {
        return 'BRL';
    }

    try {
        new Intl.NumberFormat('pt-BR', { style: 'currency', currency: normalizedCurrency });
        return normalizedCurrency;
    } catch {
        return 'BRL';
    }
}

export default function TransactionItem({transaction}: Props){

    const dataFormatada = `${new Date(transaction.occurredAt).toLocaleDateString('pt-BR')} ${new Date(transaction.occurredAt).toLocaleTimeString('pt-BR')}`;
    const displayCurrency = getDisplayCurrency(transaction.currency);
    const isExpense = transaction.type === TransactionType.EXPENSE;
    //extraindo o obj diretamente dos args da function
    return(
        <div className="flex items-center justify-between gap-4 p-4 transition hover:bg-slate-50">
            <div className="min-w-0">
                {/*
                    description
                */}
                <p className="truncate font-medium text-slate-950">{transaction.description}</p>
                <p className="mt-1 text-sm text-slate-500">
                    <span>{dataFormatada}</span>
                </p>
            </div>
            <div className="shrink-0 text-right">
                <p className={`font-semibold ${isExpense ? 'text-red-600' : 'text-emerald-600'}`}>
                    {/* Formatando o dinheiro para o padrão brasileiro */}
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: displayCurrency }).format(transaction.amount)}
                </p>
                <p className={`mt-1 inline-flex rounded px-2 py-1 text-xs font-semibold ${
                    isExpense
                        ? 'bg-red-50 text-red-700'
                        : 'bg-emerald-50 text-emerald-700'
                }`}>
                    {isExpense ? 'Despesa' : 'Receita'}
                </p>


                {/* Botões que a Task pediu para deixar visíveis (sem lógica ainda) */}
                <div className="mt-2 flex justify-end gap-3">
                    <Link
                        href={`/transactions/${transaction.id}/edit`}
                        className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline"
                    >
                        Editar
                    </Link>
                    <button className="text-xs font-medium text-red-500 hover:text-red-700">Excluir</button>
                </div>
            </div>
        </div>
    );
    /* new Data(ocurredAt) : converte a string ISO do backend em um obj de data do javascript
       toLocale fomata pra o padrao BR


        new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(transaction.amount)
        utiliza APi nativa do navegador para garantir que o numero vire uma string de moeda
     */
}
