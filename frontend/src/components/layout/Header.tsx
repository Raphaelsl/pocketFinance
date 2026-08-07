import Link from 'next/link';

export function Header() {
    return (
        <header className="bg-blue-600 text-white shadow-md">
            <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold">
                    <Link href="/">PocketFinance</Link>
                </h1>

                <nav className="flex gap-6">
                    <Link
                        href="/dashboard"
                        className="font-medium hover:text-blue-200 transition-colors"
                    >
                        Dashboard
                    </Link>
                    <Link
                        href="/transactions"
                        className="font-medium hover:text-blue-200 transition-colors"
                    >
                        Transações
                    </Link>
                </nav>
            </div>
        </header>
    );
}
