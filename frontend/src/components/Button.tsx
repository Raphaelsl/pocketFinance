// src/components/Button.tsx

interface ButtonProps {
    text: string;
    disabled?: boolean;
    onClick: () => void;
}

export default function Button({ text, disabled, onClick }: ButtonProps) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`px-4 py-2 rounded-md font-bold border-none transition-colors ${
                disabled
                    ? 'bg-gray-300 text-gray-700 cursor-not-allowed opacity-80'
                    : 'bg-blue-600 text-white cursor-pointer hover:bg-blue-700 shadow-sm'
            }`}
        >
            {text}
        </button>
    );
}