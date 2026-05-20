/**
 * SPEC-002 Code Reference
 * File: src/app/layout.tsx
 *
 * Layout global. Estrutura que aparece em TODAS as páginas.
 * Usado por Next.js automaticamente.
 */

import type { Metadata } from 'next'
import { Header } from '@/components/layout/Header'
import './globals.css'

// Metadata: título e descrição da app
// Aparece em abas do browser e SEO
export const metadata: Metadata = {
  title: 'PocketFinance',
  description: 'Controle financeiro pessoal',
}

/**
 * RootLayout: componente principal
 *
 * @param children - conteúdo das páginas (page.tsx)
 * Automaticamente passado por Next.js
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body>
        {/* Header: aparece em todas as páginas */}
        <Header />

        {/* Main: conteúdo específico de cada página */}
        <main className="max-w-6xl mx-auto px-4 py-8">
          {children}
        </main>
      </body>
    </html>
  )
}

/**
 * 🧠 O que acontece?
 *
 * User acessa: /transactions
 * Next.js roda:
 *   1. Layout (este arquivo) renderiza
 *   2. {children} = conteúdo de app/transactions/page.tsx
 *   3. HTML final:
 *      <html>
 *        <body>
 *          <Header /> ← de todas as páginas
 *          <main>
 *            (conteúdo de page.tsx)
 *          </main>
 *        </body>
 *      </html>
 *
 * 💡 Padrão: Layout envolvem {children}
 * Permite reutilizar Header, Footer, etc sem repetir
 */
