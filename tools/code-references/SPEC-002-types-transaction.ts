/**
 * SPEC-002 Code Reference
 * File: src/types/transaction.ts
 *
 * Este arquivo define TODOS os tipos TypeScript relacionados a Transaction.
 * Reutilizado em: services, components, pages.
 *
 * ✅ Deve estar pronto ANTES de começar C2
 */

// Interface principal: representa 1 transação vinda do backend
export interface Transaction {
  id: string                    // UUID
  amount: number                // valor em número
  currency: string              // "BRL", "USD", etc
  description: string           // "Compra no mercado"
  occurredAt: string            // ISO 8601: "2024-03-03T10:30:00Z"
  categoryId: string | null     // pode não ter categoria
  categoryName: string | null   // nome da categoria (se existir)
  metadata: string | null       // campo opcional
  createdAt: string             // timestamp criação
  updatedAt: string             // timestamp última atualização
}

// Interface genérica: qualquer lista paginada
// Exemplo: PagedResponse<Transaction>, PagedResponse<Category>, etc
export interface PagedResponse<T> {
  content: T[]                  // array do tipo T
  page: number                  // página atual (0-based)
  size: number                  // itens por página
  totalElements: number         // total de items
  totalPages: number            // número de páginas
  first: boolean                // é a primeira página?
  last: boolean                 // é a última página?
}

// Interface para CRIAR uma transação (POST request)
// Nota: não tem 'id', 'createdAt', 'updatedAt' (backend gera)
export interface TransactionCreateRequest {
  amount: number
  currency: string
  description: string
  occurredAt: string
  categoryId?: string | null    // opcional
  metadata?: string | null      // opcional
}

// Interface para ATUALIZAR uma transação (PUT request)
// Igual ao Create (mesmos campos)
export interface TransactionUpdateRequest extends TransactionCreateRequest {}

/**
 * 🧠 Por que separar Create/Update do Transaction?
 *
 * Transaction tem: id, createdAt, updatedAt (vindo do backend)
 * CreateRequest não tem: são gerados pelo backend
 *
 * Se Dev tentar fazer: const req: Transaction = data;
 * TypeScript avisa: "Erro! Transaction precisa de id/createdAt/updatedAt"
 *
 * Isso evita bugs!
 */
