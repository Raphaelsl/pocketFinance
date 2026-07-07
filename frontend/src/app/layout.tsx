import type { Metadata } from 'next'
import { Header } from '@/components/layout/Header'
import './globals.css'
import { Providers } from './providers'

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
      <Providers>
        <Header />
        <main className="max-w-6xl mx-auto px-4 py-8">
          {children}
        </main>
      </Providers>
      </body>
      </html>
  )
}
