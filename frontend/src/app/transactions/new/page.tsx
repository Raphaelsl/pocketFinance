'use client';


import {useState} from "react";
import {useRouter} from "next/navigation";
import Link from "next/link";
import { transactionService } from "@/services/transactionService";
import { TransactionType } from '@/types/transaction';

type FormErrors = {
    amount: string;
    type: string;
    currency: string;
    description: string;
    occurredAt: string;
};
type FormValues = {
    amount: number;
    type: TransactionType;
    currency: string;
    description: string;
    occurredAt: string;
};
type ValidationRule = (values: FormValues) => string;
type ValidationSchema = {
    [K in keyof FormValues]: ValidationRule[];
};


const validationSchema: ValidationSchema = {
    amount: [
        (values) => (values.amount <= 0 ? "Valor deve ser maior que zero" : ""),
    ],
    type: [
        (values) => (!values.type ? "Tipo obrigatorio" : ""),
    ],
    currency: [
        (values) => (!values.currency.trim() ? "Moeda obrigatoria" : ""),
    ],
    description: [
        (values) => (!values.description.trim() ? "Descricao obrigatoria" : ""),
    ],
    occurredAt: [
        (values) => (!values.occurredAt.trim() ? "Data obrigatoria" : ""),
    ],
};
function validateForm(values: FormValues, schema: ValidationSchema): FormErrors {
    const fields = Object.keys(schema) as (keyof FormValues)[];
    const errors = {} as FormErrors;

    for (const field of fields) {
        const rules = schema[field];
        let message = "";

        for (const rule of rules) {
            message = rule(values);
            if (message) break;
        }

        errors[field] = message;
    }

    return errors;
}

export default function NewTransactionsPage() {
    const router = useRouter();

    const [amount, setAmount] = useState<number>(0);
    const [type, setType] = useState<TransactionType>(TransactionType.EXPENSE);
    const [currency, setCurrency] = useState<string>('BRL');
    const [description, setDescription] = useState<string>('');
    const [occurredAt, setOccurredAt] = useState<string>('');
    const [errors, setErrors] = useState<FormErrors>({
        amount: "",
        type: "",
        currency: "",
        description: "",
        occurredAt: "",
    });
    const [loading, setLoading] = useState<boolean>(false);
    const [apiError, setApiError] = useState<string>('');




    const validate = (): boolean => {
        // include type directly to satisfy FormValues typing (avoid any cast)
        const values: FormValues = { amount, type, currency, description, occurredAt };
        const newErrors = validateForm(values, validationSchema);

        setErrors(newErrors);
        return Object.values(newErrors).every((msg) => msg === "");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setApiError("");
        const isValid = validate();
        if (!isValid) {
            return;
        }
        setLoading(true);
        try{
            await  transactionService.create({
                amount,
                type,
                currency : currency.trim().toUpperCase(),
                description: description.trim(),
                occurredAt: new Date(occurredAt).toISOString(),
            });
            router.push("/transactions");
            router.refresh();
        }catch(err){
            setApiError(err instanceof Error ? err.message :  "Erro ao criar transação");
        }finally {
            setLoading(false);
        }
    }
    return (
        <main className="min-h-screen bg-slate-50 px-4 py-10">
            <section className="mx-auto max-w-2xl">
                <div className="mb-6">
                    <Link href="/transactions" className="text-sm font-medium text-slate-500 hover:text-slate-900">
                        Voltar
                    </Link>
                    <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">Nova transação</h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="grid gap-5 sm:grid-cols-2">
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-slate-700">Valor</label>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(Number(e.target.value))}
                                placeholder="0,00"
                                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-950 outline-none transition focus:border-slate-950 focus:ring-2 focus:ring-slate-200"
                            />
                            {errors.amount && <p className="mt-1 text-sm text-red-600">{errors.amount}</p>}
                        </div>

                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-slate-700">Tipo</label>
                            <select
                                value={type}
                                onChange={(e) => setType(e.target.value as TransactionType)}
                                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-950 outline-none transition focus:border-slate-950 focus:ring-2 focus:ring-slate-200"
                            >
                                <option value={TransactionType.EXPENSE}>Despesa</option>
                                <option value={TransactionType.INCOME}>Receita</option>
                            </select>
                            {errors.type && <p className="mt-1 text-sm text-red-600">{errors.type}</p>}
                        </div>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-slate-700">Moeda</label>
                            <input
                                type="text"
                                value={currency}
                                onChange={(e) => setCurrency(String(e.target.value))}
                                placeholder="BRL"
                                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 uppercase text-slate-950 outline-none transition focus:border-slate-950 focus:ring-2 focus:ring-slate-200"
                            />
                            {errors.currency && <p className="mt-1 text-sm text-red-600">{errors.currency}</p>}
                        </div>

                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-slate-700">Data</label>
                            <input
                                type="datetime-local"
                                value={occurredAt}
                                onChange={(e) => setOccurredAt(e.target.value)}
                                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-950 outline-none transition focus:border-slate-950 focus:ring-2 focus:ring-slate-200"
                            />
                            {errors.occurredAt && (
                                <p className="mt-1 text-sm text-red-600">{errors.occurredAt}</p>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-slate-700">Descrição</label>
                        <input
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Descrição"
                            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-950 outline-none transition focus:border-slate-950 focus:ring-2 focus:ring-slate-200"
                        />
                        {errors.description && (
                            <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                        )}
                    </div>

                    {apiError && <p className="rounded-md bg-red-50 px-3 py-2 text-sm font-medium text-red-700">{apiError}</p>}

                    <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-5">
                        <Link href="/transactions" className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
                            Cancelar
                        </Link>
                        <button
                            type="submit"
                            disabled={loading}
                            className="rounded-md bg-slate-950 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading ? "Criando..." : "Criar transação"}
                        </button>
                    </div>
                </form>
            </section>
        </main>
    );


}
