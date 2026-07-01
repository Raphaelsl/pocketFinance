export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
}

export interface Transaction {
  id: string
  amount: number
  type: TransactionType
  currency: string
  description: string
  occurredAt: string
  categoryId: string | null
  categoryName: string | null
  metadata: string | null
  createdAt: string
  updatedAt: string
}

export interface PagedResponse<T> {
  content: T[]
  page: number
  size: number
  totalElements: number
  totalPages: number
  first: boolean
  last: boolean
}

export interface TransactionCreateRequest {
  amount: number
  type: TransactionType
  currency: string
  description: string
  occurredAt: string
  categoryId?: string | null
  metadata?: string | null
}

export type TransactionUpdateRequest = TransactionCreateRequest;
