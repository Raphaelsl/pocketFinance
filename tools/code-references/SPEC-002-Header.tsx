/**
 * SPEC-002 Code Reference
 * File: src/components/layout/Header.tsx
 *
 * Componente simples do header. Sem lógica complexa, só exibição.
 */

export function Header() {
  return (
    <header className="bg-blue-600 text-white shadow-md">
      {/* Container com max-width e padding */}
      <div className="max-w-6xl mx-auto px-4 py-4">
        {/* Logo/Título */}
        <h1 className="text-2xl font-bold">PocketFinance</h1>
      </div>
    </header>
  )
}

/**
 * 🧠 Classes Tailwind usadas:
 *
 * bg-blue-600       = background azul (#2563eb)
 * text-white        = texto branco
 * shadow-md         = sombra média
 * max-w-6xl         = largura máxima 896px
 * mx-auto           = centraliza horizontalmente
 * px-4              = padding horizontal 16px
 * py-4              = padding vertical 16px
 * text-2xl          = font-size grande
 * font-bold         = font-weight bold
 *
 * 💡 Padrão: [propriedade]-[valor]
 * bg = background, text = color, p = padding, m = margin
 */
