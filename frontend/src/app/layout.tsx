import type { Metadata } from 'next'
import { Header } from '@/components/layout/Header'
import './globals.css'

export const metadata: Metadata = {
  title: 'PocketFinance',
  description: 'Controle financeiro pessoal',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body>
        <Header />
        <main className="max-w-6xl mx-auto px-4 py-8">
          {children}
        </main>
      </body>
    </html>
  )
}
