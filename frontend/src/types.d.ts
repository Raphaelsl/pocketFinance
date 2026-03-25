import React from 'react';

declare global {
    namespace JSX {
        interface IntrinsicElements {
            // "É um elemento HTML normal, mas também aceita a propriedade 'texto'"
            'meu-botao': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
                texto?: string;
            };
        }
    }
}