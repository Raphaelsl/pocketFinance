'use client';

import {useState} from "react";
import {useRouter} from "next/navigation";

export default function NewTransactionsPage() {
    const router = useRouter();

    const [amount,setAmount] = useState<number>(0);
    const [currency, setCurrency] = useState<string>('BRL');
    const [description, setDescription] = useState<string>('');
    const [occurredAt, setOccurredAt] = useState<string>('');
    const [errors, setErrors] = useState({ amount: '', currency: '', description: '', occurredAt: '' });
    const [loading, setLoading] = useState<boolean>(false);
    const [apiError, setApiError] = useState<string>('');

    const handleSubmit = async(e: React.FormEvent) => {
        e.preventDefault();
    }

    return (
        <main className="container mx-auto p-6 max-w-3xl">
            <h1 className="text-2xl font-bold mb-6">Nova Transação</h1>
            <form onSubmit={handleSubmit}>
                {/* Inputs aqui, ex.: */}
                <input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} placeholder="Valor" />
                {/* Adicione os outros inputs */}
                <button type="submit" disabled={loading}>Criar Transação</button>
            </form>
        </main>
    );


}