import {Transaction, TransactionType} from "@/types/transaction";
interface Props{
    transaction: Transaction;// exige obrigatoriamente um obj Transaction
}
export default function TransactionItem({transaction}: Props){

    const dataFormatada = `${new Date(transaction.occurredAt).toLocaleDateString('pt-BR')} ${new Date(transaction.occurredAt).toLocaleTimeString('pt-BR')}`;
    //extraindo o obj diretamente dos args da function
    return(
        <div className="flex justify-between items-center p-4 border-b">
            <div>
                {/*
                    description
                */}
                <p className="font-bold text-gray-500">{transaction.description}</p>
                <p className="text-sm text-gray-500">
                    <span>{dataFormatada}</span>
                </p>
            </div>
            <div className="text-right">
                <p className={`font-semibold ${transaction.type === TransactionType.EXPENSE ? 'text-red-500' : 'text-green-500'}`}>
                    {/* Formatando o dinheiro para o padrão brasileiro */}
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: transaction.currency || 'BRL' }).format(transaction.amount)}
                </p>
                <p className={`text-xs font-bold px-2 py-1 rounded ${
                    transaction.type === TransactionType.EXPENSE
                        ? 'bg-red-100 text-red-700'
                        : 'bg-green-100 text-green-700'
                }`}>
                    {transaction.type}
                </p>


                {/* Botões que a Task pediu para deixar visíveis (sem lógica ainda) */}
                <div className="flex gap-2 mt-2">
                    <button className="text-xs text-blue-500 hover:underline">Editar</button>
                    <button className="text-xs text-red-400 hover:underline">Excluir</button>
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