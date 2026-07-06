// eslint-disable-next-line @typescript-eslint/no-require-imports
const nextJest = require('next/jest');

const createJestConfig = nextJest({
    // Aponta para a raiz do projeto para o Jest carregar o Next.js corretamente
    dir: './',
});

const customJestConfig = {
    // Diz ao Jest para simular o navegador na memória (para ler as tags HTML/React)
    testEnvironment: 'jest-environment-jsdom',
};

module.exports = createJestConfig(customJestConfig);