'use client';


import {useState} from "react";
import {useRouter} from "next/navigation";
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
    const [type, setType] = useState<TransactionType>(TransactionType.INCOME);
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
        <main className="container mx-auto p-6 max-w-3xl">
            <h1 className="text-2xl font-bold mb-6">Nova Transação</h1>
            <form onSubmit={handleSubmit}>


                <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    placeholder="Valor"
                />
                <select
                    value={type}
                    onChange={(e) => setType(e.target.value as TransactionType)}
                >
                    <option value={TransactionType.INCOME}>INCOME</option>
                    <option value={TransactionType.EXPENSE}>EXPENSE</option>
                </select>
                {errors.type && <p className="text-red-500 text-sm">{errors.type}</p>}
                {errors.amount && <p className="text-red-500 text-sm">{errors.amount}</p>}
                <input
                    type="text"
                    value={currency}
                    onChange={(e) => setCurrency(String(e.target.value))}
                    placeholder="BRL"
                />
                {errors.currency && <p className="text-red-500 text-sm">{errors.currency}</p>}
                <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Descrição"
                />
                {errors.description && (
                    <p className="text-red-500 text-sm">{errors.description}</p>
                )}
                <input
                    type="datetime-local"
                    value={occurredAt}
                    onChange={(e) => setOccurredAt(e.target.value)}
                />
                {errors.occurredAt && (
                    <p className="text-red-500 text-sm">{errors.occurredAt}</p>
                )}
                {apiError && <p className="text-red-600 text-sm">{apiError}</p>}

                <button type="submit" disabled={loading}>
                    {loading ? "Criando..." : "Criar Transação"}
                </button>



            </form>


        </main>
    );


}