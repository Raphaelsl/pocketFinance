# SPEC-007 Code Reference

Reference for Pos-C: Architecture & Code Quality.

This file is not a copy/paste solution. Use it during pair programming to compare
the current implementation with a cleaner shape after Epic C.

---

## 1. Query Keys and Domain Hooks

Goal: keep React Query details close to the transaction domain, while pages keep
screen layout and navigation.

```typescript
// src/hooks/useTransactionQueries.ts

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { transactionService } from '@/services/transactionService';
import type { TransactionUpdateRequest } from '@/types/transaction';

export const transactionKeys = {
  all: ['transactions'] as const,
  list: (page: number) => [...transactionKeys.all, page] as const,
  detail: (id: string) => [...transactionKeys.all, 'detail', id] as const,
};

export function useTransactions(page: number) {
  const { data, isLoading, isError } = useQuery({
    queryKey: transactionKeys.list(page),
    queryFn: () => transactionService.list(page, 10),
  });

  return {
    transactions: data?.content ?? [],
    loading: isLoading,
    error: isError ? 'Nao foi possivel carregar as transacoes.' : null,
    totalPages: data?.totalPages ?? 0,
  };
}

export function useUpdateTransaction(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: TransactionUpdateRequest) =>
      transactionService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transactionKeys.all });
      queryClient.invalidateQueries({ queryKey: transactionKeys.detail(id) });
    },
  });
}

export function useDeleteTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => transactionService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transactionKeys.all });
    },
  });
}
```

Discussion with the Dev:

- `useTransactions` already existed after C5; Pos-C makes the pattern explicit.
- The page still decides what modal is open and where to navigate.
- The hook owns cache invalidation because it is React Query behavior, not UI.

---

## 2. Payload Normalization

Goal: create and edit should send the same payload shape.

```typescript
// src/services/transactionPayload.ts

import type {
  TransactionCreateRequest,
  TransactionUpdateRequest,
  TransactionType,
} from '@/types/transaction';

type TransactionFormValues = {
  amount: string | number;
  type: TransactionType;
  currency: string;
  description: string;
  occurredAt: string;
};

export function toTransactionPayload(
  values: TransactionFormValues,
): TransactionCreateRequest | TransactionUpdateRequest {
  return {
    amount: Number(values.amount),
    type: values.type,
    currency: values.currency.trim().toUpperCase(),
    description: values.description.trim(),
    occurredAt: new Date(values.occurredAt).toISOString(),
  };
}
```

Things to keep explicit:

- Validation errors still belong near the form UX.
- Backend remains the source of truth for business rules.
- The helper only normalizes shape; it should not call the API.

---

## 3. Service Contract

Goal: keep the service small, typed and predictable.

```typescript
// src/services/transactionService.ts

import type {
  PagedResponse,
  Transaction,
  TransactionCreateRequest,
  TransactionUpdateRequest,
} from '@/types/transaction';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

function transactionUrl(path = '') {
  return `${API_URL}/transactions${path}`;
}

export const transactionService = {
  list: async (page = 0, size = 10): Promise<PagedResponse<Transaction>> => {
    const response = await fetch(transactionUrl(`?page=${page}&size=${size}`));

    if (!response.ok) {
      throw new Error('Erro ao carregar transacoes');
    }

    return response.json();
  },

  getById: async (id: string): Promise<Transaction> => {
    const response = await fetch(transactionUrl(`/${encodeURIComponent(id)}`));

    if (!response.ok) {
      throw new Error('Transacao nao encontrada');
    }

    return response.json();
  },

  create: async (data: TransactionCreateRequest): Promise<Transaction> => {
    const response = await fetch(transactionUrl(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Erro ao criar transacao');
    }

    return response.json();
  },

  update: async (
    id: string,
    data: TransactionUpdateRequest,
  ): Promise<Transaction> => {
    const response = await fetch(transactionUrl(`/${encodeURIComponent(id)}`), {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Erro ao atualizar transacao');
    }

    return response.json();
  },

  delete: async (id: string): Promise<void> => {
    const response = await fetch(transactionUrl(`/${encodeURIComponent(id)}`), {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Erro ao excluir transacao');
    }
  },
};
```

Security guardrails:

- Use `POST`, `PUT` and `DELETE` for mutations; never mutate state with `GET`.
- Keep error messages generic for users.
- Do not log transaction payloads.
- Encode path IDs before building URLs.
- Do not put secrets in `NEXT_PUBLIC_*`; those values are visible in the browser.

---

## 4. Accessible Delete Modal Shape

Goal: keep the visual modal, but make it understandable to assistive technology.

```tsx
// src/components/ConfirmDeleteModal.tsx

import { useEffect } from 'react';

type ConfirmDeleteModalProps = {
  description: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading: boolean;
  error: string | null;
};

export function ConfirmDeleteModal({
  description,
  onConfirm,
  onCancel,
  isLoading,
  error,
}: ConfirmDeleteModalProps) {
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape' && !isLoading) {
        onCancel();
      }
    }

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isLoading, onCancel]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
        className="w-full max-w-sm rounded-xl bg-white p-6 shadow-lg"
      >
        <h2 id="delete-dialog-title" className="mb-2 text-xl font-bold text-gray-900">
          Excluir transacao
        </h2>

        <p id="delete-dialog-description" className="mb-6 text-sm text-gray-600">
          Tem certeza que deseja excluir <strong>{description}</strong>? Esta acao
          nao pode ser desfeita.
        </p>

        {error && (
          <p role="alert" className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </p>
        )}

        <div className="flex items-center justify-end gap-3">
          <button type="button" onClick={onCancel} disabled={isLoading}>
            Cancelar
          </button>

          <button type="button" onClick={onConfirm} disabled={isLoading}>
            {isLoading ? 'Excluindo...' : 'Excluir'}
          </button>
        </div>
      </div>
    </div>
  );
}
```

Important:

- Render `description` as React text. Do not use `dangerouslySetInnerHTML`.
- Delete still requires explicit confirmation.
- Escape should not close while the delete request is in progress.

---

## 5. Behavior-Oriented Tests

Goal: test what the user can observe, not Tailwind implementation details.

```tsx
// src/components/test/ConfirmDeleteModal.test.tsx

import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ConfirmDeleteModal } from '../ConfirmDeleteModal';

describe('ConfirmDeleteModal', () => {
  const onConfirm = jest.fn();
  const onCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders as an accessible confirmation dialog', () => {
    render(
      <ConfirmDeleteModal
        description="Compra no mercado"
        onConfirm={onConfirm}
        onCancel={onCancel}
        isLoading={false}
        error={null}
      />,
    );

    expect(
      screen.getByRole('dialog', { name: /excluir transacao/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/compra no mercado/i)).toBeInTheDocument();
  });

  it('confirms deletion only when the delete button is clicked', () => {
    render(
      <ConfirmDeleteModal
        description="Compra no mercado"
        onConfirm={onConfirm}
        onCancel={onCancel}
        isLoading={false}
        error={null}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: /^excluir$/i }));

    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(onCancel).not.toHaveBeenCalled();
  });

  it('shows a safe error message', () => {
    render(
      <ConfirmDeleteModal
        description="Compra no mercado"
        onConfirm={onConfirm}
        onCancel={onCancel}
        isLoading={false}
        error="Erro ao excluir transacao"
      />,
    );

    expect(screen.getByRole('alert')).toHaveTextContent('Erro ao excluir transacao');
  });
});
```

Testing discussion:

- Prefer `getByRole`, labels and visible text.
- Avoid asserting exact Tailwind classes unless visual behavior is the feature.
- Do not snapshot request payloads that may contain sensitive user-entered text.

